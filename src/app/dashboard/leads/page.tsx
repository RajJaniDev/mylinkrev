import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LeadsDashboard } from "@/components/LeadsDashboard";
import { LeadsConfigForm } from "@/components/LeadsConfigForm";
import { revalidatePath } from "next/cache";

export default async function LeadsPage(
  props: {
    searchParams: Promise<{ success?: string }>;
  }
) {
  const searchParams = await props.searchParams;
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
  async function updateLeadsSettings(formData: FormData) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return;

    // Fetch existing so we don't overwrite other social links
    const { data: existing } = await supabase
      .from("businesses")
      .select("social_links")
      .eq("user_id", currentUserReq.id)
      .single();
    const existingSocials = existing?.social_links || {};

    const social_links = {
      ...existingSocials,
      contact_form_title: formData.get("contact_form_title") as string,
      contact_button_title: formData.get("contact_button_title") as string,
      contact_success_message: formData.get("contact_success_message") as string,
      hide_contact_form: formData.get("hide_contact_form") === "on",
      contact_required_fields: formData.get("contact_required_fields") as string,
    };

    await supabase
      .from("businesses")
      .update({ social_links })
      .eq("user_id", currentUserReq.id);

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");
    revalidatePath(`/b/${business.slug}`);
    
    redirect("/dashboard/leads?success=updated");
  }

  // Server Action to update a lead's status
  async function updateLeadStatus(leadId: string, newStatus: string) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return;

    const { data: b } = await supabase
      .from("businesses")
      .select("id, leads")
      .eq("user_id", currentUserReq.id)
      .single();

    if (!b) return;
    const leads = Array.isArray(b.leads) ? b.leads : [];
    const updatedLeads = leads.map((lead: any) => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );

    await supabase
      .from("businesses")
      .update({ leads: updatedLeads })
      .eq("id", b.id);

    revalidatePath("/dashboard/leads");
  }

  // Server Action to manage customization of stages
  async function updateLeadStages(newStages: string[], renamedMap?: { [old: string]: string }, deletedStages?: string[]) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return;

    const { data: b } = await supabase
      .from("businesses")
      .select("id, social_links, leads")
      .eq("user_id", currentUserReq.id)
      .single();

    if (!b) return;

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

    await supabase
      .from("businesses")
      .update({ 
        social_links: updatedSocials,
        leads: updatedLeads
      })
      .eq("id", b.id);

    revalidatePath("/dashboard/leads");
  }

  const hasPaid = business.payment_status === "active" || business.payment_status === "completed";
  const leadsCount = Array.isArray(business.leads) ? business.leads.length : 0;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {searchParams.success === "updated" && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '0.5rem' }}>
          Leads and contact form settings updated successfully!
        </div>
      )}

      {/* Free Plan Limit Info Banner */}
      {!hasPaid && (
        <div style={{
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎁 Free Plan Limit:</span>
            <strong style={{ color: 'var(--primary)' }}>{leadsCount} / 7</strong>
            <span>leads collected</span>
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            Under the free plan, you can collect a maximum of 7 customer leads. Once you reach this limit, the contact form on your public profile will be disabled. Upgrade to Pro for unlimited inquiries!
          </p>
        </div>
      )}

      {/* Leads Form Settings Section (Collapsible) */}
      <LeadsConfigForm socials={socials} action={updateLeadsSettings} />

      {/* Leads List Section */}
      <LeadsDashboard 
        leads={business.leads || []} 
        leadStages={leadStages}
        updateLeadStatus={updateLeadStatus}
        updateLeadStages={updateLeadStages}
      />
    </div>
  );
}
