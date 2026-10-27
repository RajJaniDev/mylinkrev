import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LeadsDashboard } from "@/components/LeadsDashboard";
import { LeadsConfigForm } from "@/components/LeadsConfigForm";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { InquiryTabs } from "@/components/dashboard/InquiryTabs";
import { revalidatePath } from "next/cache";

export default async function LeadsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch business for this user
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    redirect("/dashboard");
  }

  // Parse existing settings
  let socials: any = {};
  try {
    socials = business.social_links || {};
  } catch (e) {}

  // Get active lead stages (custom or fallback to defaults)
  const leadStages = socials.lead_stages || ["New", "Contacted", "Accepted", "Rejected"];

  // Server Action to update leads configuration settings
  async function updateLeadsSettings(_previous: { error: string; saved: number }, formData: FormData): Promise<{ error: string; saved: number }> {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return { error: "Please sign in again before saving.", saved: 0 };

    // Fetch existing so we don't overwrite other social links
    const { data: existing, error: fetchError } = await supabase
      .from("businesses")
      .select("social_links")
      .eq("user_id", currentUserReq.id)
      .single();
    if (fetchError || !existing) return { error: "We couldn’t load your settings. Please try again.", saved: 0 };
    const required = String(formData.get("contact_required_fields") || "email");
    const title = String(formData.get("contact_form_title") || "").trim();
    const button = String(formData.get("contact_button_title") || "").trim();
    const message = String(formData.get("contact_success_message") || "").trim();
    if (!["email", "phone", "both"].includes(required) || !title || title.length > 120 || !button || button.length > 80 || !message || message.length > 500) return { error: "Check your form wording and contact requirements, then try again.", saved: 0 };
    const existingSocials = existing.social_links || {};

    const social_links = {
      ...existingSocials,
      contact_form_title: title,
      contact_button_title: button,
      contact_success_message: message,
      hide_contact_form: formData.get("accept_inquiries") !== "on",
      contact_required_fields: required,
    };

    const { error: saveError } = await supabase
      .from("businesses")
      .update({ social_links })
      .eq("user_id", currentUserReq.id);

    if (saveError) return { error: "Your form couldn’t be saved. Please try again.", saved: 0 };
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");
    revalidatePath(`/b/${business.slug}`);
    
    revalidatePath("/dashboard", "layout");
    return { error: "", saved: Date.now() };
  }

  // Server Action to update a lead's status
  async function updateLeadStatus(leadId: string, newStatus: string) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return { error: "Please sign in again." };

    const { data: b } = await supabase
      .from("businesses")
      .select("id, leads, social_links")
      .eq("user_id", currentUserReq.id)
      .single();

    if (!b) return { error: "Unable to load your inquiries." };
    const allowed = Array.isArray(b.social_links?.lead_stages) ? b.social_links.lead_stages : ["New", "Contacted", "Accepted", "Rejected"];
    if (!allowed.includes(newStatus)) return { error: "Choose a valid stage." };
    const leads = Array.isArray(b.leads) ? b.leads : [];
    if (!leads.some((lead: any) => lead.id === leadId)) return { error: "This inquiry is no longer available. Refresh your inbox." };
    const updatedLeads = leads.map((lead: any) => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ leads: updatedLeads })
      .eq("id", b.id);

    if (updateError) return { error: "The stage couldn’t be saved. Please try again." };
    revalidatePath("/dashboard", "layout");
  }

  // Server Action to manage customization of stages
  async function updateLeadStages(newStages: string[], renamedMap?: { [old: string]: string }, deletedStages?: string[]) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return { error: "Please sign in again." };
    if (!Array.isArray(newStages) || !newStages.length || newStages.length > 15 || newStages.some(stage => typeof stage !== "string" || !stage.trim() || stage.length > 60) || new Set(newStages).size !== newStages.length) return { error: "Use between 1 and 15 unique stage names, up to 60 characters each." };

    const { data: b } = await supabase
      .from("businesses")
      .select("id, social_links, leads")
      .eq("user_id", currentUserReq.id)
      .single();

    if (!b) return { error: "Unable to load your inquiries." };

    const existingSocials = b.social_links || {};
    const updatedSocials = {
      ...existingSocials,
      lead_stages: newStages
    };

    const leads = Array.isArray(b.leads) ? b.leads : [];
    const defaultStatus = newStages[0] || "New";

    const updatedLeads = leads.map((lead: any) => {
      let currentStatus = lead.status || "New";
      
      if (renamedMap && renamedMap[currentStatus]) {
        currentStatus = renamedMap[currentStatus];
      }
      
      if ((deletedStages && deletedStages.includes(currentStatus)) || !newStages.includes(currentStatus)) {
        currentStatus = defaultStatus;
      }
      
      return { ...lead, status: currentStatus };
    });

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ 
        social_links: updatedSocials,
        leads: updatedLeads
      })
      .eq("id", b.id);

    if (updateError) return { error: "Your stages couldn’t be saved. Please try again." };
    revalidatePath("/dashboard", "layout");
  }

  const hasPaid = business.payment_status === "active" || business.payment_status === "completed";
  const leadsCount = Array.isArray(business.leads) ? business.leads.length : 0;

  return <div className="dash-page"><div className="dash-page-heading"><div><span className="dash-eyebrow">KEEP THE CONVERSATION GOING</span><h1>Inquiries</h1><p>Read new messages, follow up and move each conversation to its next stage.</p></div><Link href={`/b/${business.slug}`} target="_blank" rel="noopener noreferrer" className="dash-button dash-button-secondary">View my page <ArrowUpRight size={15}/></Link></div>{!hasPaid && <div className="dash-usage"><progress value={Math.min(leadsCount, 7)} max={7} aria-label="Free lead allowance used"/><span>{leadsCount} of 7 free leads collected</span><Link href="/dashboard/profile#plan" className="dash-text-link">{leadsCount >= 7 ? 'Upgrade to receive more' : 'View plan'}</Link></div>}<InquiryTabs inbox={<LeadsDashboard leads={business.leads || []} leadStages={leadStages} updateLeadStatus={updateLeadStatus} updateLeadStages={updateLeadStages}/>} form={<div className="dash-form-layout"><LeadsConfigForm socials={socials} action={updateLeadsSettings}/><aside className="dash-card dash-form-note"><h3>A simple first step.</h3><p>Use your form to start a conversation, then arrange details directly with the client.</p><ul><li>Keep button wording specific to your service.</li><li>Collect only the contact details you need.</li><li>For astrology consultations, arrange sensitive birth details separately.</li></ul><p>Preview your page to check the form. Test inquiries count toward your free allowance.</p></aside></div>}/></div>;
}
