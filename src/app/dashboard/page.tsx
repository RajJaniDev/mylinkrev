import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { audiences, isAudience } from '@/lib/audiences';
import RegisterBusinessForm from '@/components/RegisterBusinessForm';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const { data: business, error } = await supabase.from('businesses').select('*').eq('user_id', user.id).maybeSingle();
  if (error) throw new Error('Unable to load your workspace. Please try again.');
  // Server action to handle business registration
  async function registerBusiness(_previous: { error: string }, formData: FormData): Promise<{ error: string }> {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return { error: "Please sign in again to create your page." };

    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim().toLowerCase();
    const description = String(formData.get("description") || "").trim();
    const audienceValue = String(formData.get("audience") || "coaches");
    if (!name || name.length > 100 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 60 || description.length > 500 || !isAudience(audienceValue)) {
      return { error: "Add a name and a valid link using letters, numbers and single hyphens." };
    }
    const preset = audiences[audienceValue];
    const finalSlug = slug;
    const { data: ownedBusiness, error: ownershipError } = await supabase.from("businesses").select("id").eq("user_id", currentUserReq.id).maybeSingle();
    if (ownershipError) return { error: "We couldn’t check your account. Please try again." };
    if (ownedBusiness) redirect("/dashboard");

    const { error } = await supabase.from("businesses").insert({
      user_id: currentUserReq.id,
      slug: finalSlug,
      name,
      description,
      payment_status: 'pending',
      social_links: {
        credits: 7,
        hide_google_rate: true,
        audience: audienceValue,
        hide_contact_form: formData.get("capture_leads") !== "on",
        contact_button_title: preset.cta,
        contact_form_title: preset.formTitle,
        contact_success_message: "Thank you for your inquiry. I’ll be in touch using the contact details you provided.",
        contact_required_fields: "email",
        lead_stages: [...preset.stages]
      }
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: error.code === "23505" ? "That link was just taken. Please choose another." : "We couldn’t create your page. Please try again; your details are still here." };
    }

    revalidatePath("/dashboard", "layout");
    redirect("/dashboard?success=registered");
  }


  if (!business) return <RegisterBusinessForm registerAction={registerBusiness}/>;
  return <DashboardOverview business={business} firstName={user.firstName} params={params}/>;
}
