import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { ShareLink } from '@/components/dashboard/ShareLink';
import { SubmitButton } from '@/components/SubmitButton';

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  // Fetch cookies and headers for geo-detection
  const cookieStore = await cookies();
  const headersList = await headers();

  // Multi-layered location check
  let isIndia = false;
  const isIndiaCookie = cookieStore.get("user_is_india")?.value;
  if (isIndiaCookie !== undefined) {
    isIndia = isIndiaCookie === "true";
  } else {
    const countryHeader = (
      headersList.get("cf-ipcountry") || 
      headersList.get("x-vercel-ip-country") || 
      headersList.get("cloudfront-viewer-country") || 
      headersList.get("x-country-code") || 
      ""
    ).toUpperCase();

    if (countryHeader === "IN") {
      isIndia = true;
    } else {
      const acceptLang = headersList.get("accept-language") || "";
      if (acceptLang.includes("en-IN") || acceptLang.includes("hi-IN")) {
        isIndia = true;
      }
    }
  }

  // Fetch settings from database
  const { data: settingsData } = await supabase
    .from("settings")
    .select("key, value");

  const settings = settingsData?.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const priceUsd = settings.price_usd_amount || "30";
  const priceInr = settings.price_inr_amount || "2499";
  const priceText = isIndia ? `₹${priceInr}` : `$${priceUsd}`;

  // Fetch business for this user
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!business) redirect("/dashboard");

  const hasPaid = business?.payment_status === "completed" || business?.payment_status === "active";

  // Server action to handle the update
  async function updateBusinessDetails(_previous: { error: string; saved: number }, formData: FormData): Promise<{ error: string; saved: number }> {
    "use server";
    
    // Verify user is still authenticated
    const currentUserReq = await currentUser();
    if (!currentUserReq) return { error: "Please sign in again before saving.", saved: 0 };

    const name = String(formData.get("name") || "").trim();
    if (!name || name.length > 100) return { error: "Add a name of up to 100 characters.", saved: 0 };
    const description = String(formData.get("description") || "").trim();
    if (description.length > 1000) return { error: "Keep your introduction within 1,000 characters.", saved: 0 };
    const google_review_url = formData.get("google_review_url") as string;
    
    // Fetch existing so we don't overwrite the photo if no new one is uploaded
    const { data: existing, error: fetchError } = await supabase.from("businesses").select("social_links, slug").eq("user_id", currentUserReq.id).single();
    if (fetchError || !existing) return { error: "We couldn’t load your current page. Please try again.", saved: 0 };
    const existingSocials = existing.social_links || {};

    let base64Photo = existingSocials.profile_photo || "";
    const photoFile = formData.get("profile_photo") as File | null;
    
    if (photoFile && photoFile.size > 0) {
      if (photoFile.size > 2 * 1024 * 1024) {
        // Keep entered details when the selected image is too large.
        return { error: "Your photo is too large. Choose an image smaller than 2 MB.", saved: 0 };
      }
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(photoFile.type)) return { error: "Choose a JPG, PNG, WebP or GIF image.", saved: 0 };
      const buffer = await photoFile.arrayBuffer();
      base64Photo = `data:${photoFile.type};base64,${Buffer.from(buffer).toString("base64")}`;
    }
    
    const collections: Record<string, unknown[]> = {};
    try {
      for (const key of ["showcase_videos", "showcase_apps", "showcase_products", "custom_links"]) {
        const parsed: unknown = JSON.parse(String(formData.get(key) || "[]"));
        if (!Array.isArray(parsed)) throw new Error("Invalid collection");
        collections[key] = parsed;
      }
    } catch { return { error: "We couldn’t read your links or showcase. Please check them and try again.", saved: 0 }; }
    const social_links = {
      ...existingSocials,
      facebook: formData.get("facebook") as string,
      instagram: formData.get("instagram") as string,
      location: formData.get("location") as string,
      map_url: formData.get("map_url") as string,
      whatsapp: formData.get("whatsapp") as string,
      email: formData.get("email") as string,
      youtube: formData.get("youtube") as string,
      twitter: formData.get("twitter") as string,
      linkedin: formData.get("linkedin") as string,
      phone: formData.get("phone") as string,
      booking_url: formData.get("booking_url") as string,
      always_positive: existingSocials.always_positive || false,
      hide_google_rate: formData.get("hide_google_rate") === "on",
      hide_showcase: formData.get("hide_showcase") === "on",
      profile_photo: base64Photo,
      theme_primary: formData.get("theme_primary") as string,
      theme_secondary: formData.get("theme_secondary") as string,
      showcase_videos: collections.showcase_videos,
      showcase_apps: collections.showcase_apps,
      showcase_products: collections.showcase_products,
      custom_links: collections.custom_links,
      credits: existingSocials.credits !== undefined ? existingSocials.credits : 7,
      contact_form_title: existingSocials.contact_form_title !== undefined ? existingSocials.contact_form_title : "Contact Us",
      contact_button_title: existingSocials.contact_button_title !== undefined ? existingSocials.contact_button_title : "Send Inquiry",
      contact_success_message: existingSocials.contact_success_message !== undefined ? existingSocials.contact_success_message : "Thank you! We will get back to you soon.",
      hide_contact_form: existingSocials.hide_contact_form !== undefined ? existingSocials.hide_contact_form : false,
    };

    // Scope the update to the authenticated owner.
    const { error: saveError } = await supabase
      .from("businesses")
      .update({
        name,
        description,
        google_review_url,
        social_links
      })
      .eq("user_id", currentUserReq.id);

    if (saveError) return { error: "Your changes couldn’t be saved. Please try again.", saved: 0 };

    // Revalidate the page so Next.js clears the cache and shows fresh data
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/profile");
    revalidatePath(`/b/${existing?.slug || ''}`);
    return { error: "", saved: Date.now() };
  }


  return <div className="dash-page"><div className="dash-page-heading"><div><span className="dash-eyebrow">MAKE IT YOURS</span><h1>My page</h1><p>Start with the essentials. Add the extras whenever you’re ready.</p></div><span className="dash-badge">{hasPaid ? 'Pro plan' : 'Free plan'}</span></div><ShareLink slug={business.slug}/><ProfileEditor business={business} action={updateBusinessDetails}/><section className="dash-card dash-plan-card" id="plan"><div><span className="dash-eyebrow">YOUR PLAN</span><h2>{hasPaid ? 'You’re on Pro.' : 'Start free. Upgrade when you need more.'}</h2><p>{hasPaid ? 'Unlimited inquiries and additional profile customization are available on your account.' : 'Your free allowance includes 7 captured leads and 7 optional AI review credits. Review billing terms at checkout before upgrading.'}</p></div>{!hasPaid && <form action="/api/checkout" method="POST"><input type="hidden" name="userId" value={user.id}/><input type="hidden" name="slug" value={business.slug}/><SubmitButton>Explore Pro ({priceText})</SubmitButton></form>}</section></div>;
}
