import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "@/components/SubmitButton";

import { UserButton } from "@clerk/nextjs";

export default async function Dashboard(
  props: {
    searchParams: Promise<{ success?: string; canceled?: string; error?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch business for this user
  // In a real app with Clerk + Supabase, we would use Supabase JWT integration. 
  // For simplicity, we are fetching directly, assuming server-side security.
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const hasPaid = true; // Temporarily bypass payment check

  // Server action to handle the update
  async function updateBusinessDetails(formData: FormData) {
    "use server";
    
    // Verify user is still authenticated
    const currentUserReq = await currentUser();
    if (!currentUserReq) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const google_review_url = formData.get("google_review_url") as string;
    
    // Fetch existing so we don't overwrite the photo if no new one is uploaded
    const { data: existing } = await supabase.from("businesses").select("social_links, slug").eq("user_id", currentUserReq.id).single();
    const existingSocials = existing?.social_links || {};

    let base64Photo = existingSocials.profile_photo || "";
    const photoFile = formData.get("profile_photo") as File | null;
    
    if (photoFile && photoFile.size > 0) {
      if (photoFile.size > 2 * 1024 * 1024) {
        // Redirect with error message if file is > 2MB
        redirect("/dashboard?error=Profile photo is too large. Please upload an image smaller than 2MB.");
      }
      const buffer = await photoFile.arrayBuffer();
      base64Photo = `data:${photoFile.type};base64,${Buffer.from(buffer).toString("base64")}`;
    }
    
    const social_links = {
      facebook: formData.get("facebook") as string,
      instagram: formData.get("instagram") as string,
      location: formData.get("location") as string,
      map_url: formData.get("map_url") as string,
      whatsapp: formData.get("whatsapp") as string,
      youtube: formData.get("youtube") as string,
      twitter: formData.get("twitter") as string,
      phone: formData.get("phone") as string,
      booking_url: formData.get("booking_url") as string,
      always_positive: formData.get("always_positive") === "on",
      profile_photo: base64Photo,
    };

    // Since we disabled RLS for now, we just update where user_id matches
    await supabase
      .from("businesses")
      .update({
        name,
        description,
        google_review_url,
        social_links
      })
      .eq("user_id", currentUserReq.id);

    // Revalidate the page so Next.js clears the cache and shows fresh data
    revalidatePath("/dashboard");
    revalidatePath(`/b/${existing?.slug || ''}`);
    redirect("/dashboard?success=updated");
  }

  // Parse existing social links
  let socials: any = {};
  try {
    socials = business?.social_links || {};
  } catch (e) {}

  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.5rem 0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>Settings & Logout</span>
            <UserButton />
          </div>
        </div>
        
        {searchParams.success && (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {searchParams.success === 'updated' 
              ? 'Business details updated successfully!' 
              : 'Payment successful! Your account is now active.'}
          </div>
        )}
        
        {searchParams.error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {searchParams.error === 'SlugTaken' ? 'Error: Could not create business. Make sure you have created the Supabase tables, and that your slug is unique.' : searchParams.error}
          </div>
        )}

        {!business ? (
          <div>
            <h2>Register Your Business</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Claim your custom link and pay the one-time $30 fee to unlock all features.</p>
            <form action="/api/checkout" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="hidden" name="userId" value={user.id} />
              <Input label="Business Name" name="name" required placeholder="e.g. Acme Corp" />
              <Input label="Custom Link (Slug)" name="slug" required placeholder="e.g. acme-corp" />
              <Button type="submit" variant="primary">Pay $30 & Register</Button>
            </form>
          </div>
        ) : !hasPaid ? (
          <div>
            <h2>Payment Pending</h2>
            <p>Your payment is pending. Please complete the payment to access your dashboard.</p>
            <form action="/api/checkout" method="POST">
               <input type="hidden" name="userId" value={user.id} />
               <input type="hidden" name="slug" value={business.slug} />
               <Button type="submit" variant="primary">Pay $30 Now</Button>
            </form>
          </div>
        ) : (
          <div>
             <h2 style={{ marginBottom: '1rem' }}>Welcome back, {business.name}!</h2>
             <p>Your custom link: <strong><a href={`/b/${business.slug}`} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{`myrevlink.com/b/${business.slug}`}</a></strong></p>
             
             {/* QR Code */}
             <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem' }}>Your Custom QR Code</p>
                <div style={{ width: '150px', height: '150px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://myrevlink.com/b/${business.slug}`} alt="QR Code" style={{ width: '100%', height: '100%' }} />
                </div>
             </div>

             <form action={updateBusinessDetails} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Edit Details</h3>
               
               <div className="input-group">
                 <label className="input-label">Profile Photo</label>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   {socials.profile_photo && (
                     <img src={socials.profile_photo} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                   )}
                   <input type="file" name="profile_photo" accept="image/*" className="input-field" style={{ flex: 1 }} />
                 </div>
               </div>

               <Input label="Business Name" name="name" defaultValue={business.name || ''} required placeholder="Your Business Name" />
               <Input label="Business Description" name="description" defaultValue={business.description || ''} placeholder="Tell customers about your business" />
               <Input label="Google Review URL" name="google_review_url" defaultValue={business.google_review_url || ''} placeholder="https://g.page/r/..." />
               
               <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>Social Profiles & Info</h4>
               <Input label="Facebook Page URL" name="facebook" defaultValue={socials.facebook || ''} placeholder="https://facebook.com/yourpage" />
               <Input label="Instagram URL" name="instagram" defaultValue={socials.instagram || ''} placeholder="https://instagram.com/yourprofile" />
               <Input label="YouTube Channel URL" name="youtube" defaultValue={socials.youtube || ''} placeholder="https://youtube.com/@yourchannel" />
               <Input label="Twitter (X) URL" name="twitter" defaultValue={socials.twitter || ''} placeholder="https://x.com/yourprofile" />
               
               <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>Location & Contact</h4>
               <Input label="Booking Link (Calendly, etc.)" name="booking_url" defaultValue={socials.booking_url || ''} placeholder="https://calendly.com/your-name" />
               <Input label="Physical Location" name="location" defaultValue={socials.location || ''} placeholder="123 Main St, City, Country" />
               <Input label="Google Maps URL" name="map_url" defaultValue={socials.map_url || ''} placeholder="https://maps.app.goo.gl/..." />
               <Input label="Contact Phone Number" name="phone" defaultValue={socials.phone || ''} placeholder="e.g. +1 234 567 8900" />
               <Input label="WhatsApp Number" name="whatsapp" defaultValue={socials.whatsapp || ''} placeholder="e.g. 1234567890 (Country code included)" />
               
               <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>AI Review Settings</h4>
               <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                 <input type="checkbox" name="always_positive" id="always_positive" defaultChecked={socials.always_positive} style={{ width: '1.2rem', height: '1.2rem' }} />
                 <label htmlFor="always_positive" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                   <strong>Always generate positive reviews</strong> <br/>
                   <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>If checked, the AI will generate a 5-star positive review regardless of the rating the user selects.</span>
                 </label>
               </div>
               
               <div style={{ marginTop: '1rem' }}>
                 <SubmitButton>Save Changes</SubmitButton>
               </div>
             </form>
          </div>
        )}
      </div>
    </main>
  );
}
