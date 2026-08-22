import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { QRPosterCustomizer, QRTemplateConfig } from "@/components/QRPosterCustomizer";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Manage Review QR Poster | Dashboard | MyRevLink",
  description: "Customize your Google Review QR poster templates, edit colors and branding, and download high-resolution PNG posters.",
};

export default async function ManageQRPage() {
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

  const socials = business.social_links || {};
  const savedConfig: Partial<QRTemplateConfig> = socials.qr_customization || {};

  const reviewUrl = business.google_review_url || `https://myrevlink.in/b/${business.slug}/rate`;

  const initialConfig: Partial<QRTemplateConfig> = {
    templateId: savedConfig.templateId || "google_arch",
    businessName: savedConfig.businessName || business.name,
    businessLogo: savedConfig.businessLogo || socials.profile_photo || "",
    reviewLink: savedConfig.reviewLink || reviewUrl,
    headline: savedConfig.headline || "Scan to Rate Us on Google",
    subheadline: savedConfig.subheadline || "Scan this code to leave us a 5-star review & help our local business grow!",
    thankyouNote: savedConfig.thankyouNote || "Thank you for your visit!",
    accentColor: savedConfig.accentColor || "#1a73e8",
    phone: savedConfig.phone || socials.phone || "",
    email: savedConfig.email || socials.email || "",
    location: savedConfig.location || socials.location || "",
  };

  // Server Action to save customization directly
  async function saveQRCustomization(config: QRTemplateConfig) {
    "use server";
    const userReq = await currentUser();
    if (!userReq) return;

    const { data: b } = await supabase
      .from("businesses")
      .select("id, social_links")
      .eq("user_id", userReq.id)
      .single();

    if (!b) return;

    const updatedSocials = {
      ...(b.social_links || {}),
      qr_customization: config,
    };

    await supabase
      .from("businesses")
      .update({ social_links: updatedSocials })
      .eq("id", b.id);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/qr");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Link
          href="/dashboard"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
        >
          &larr; Back to Dashboard Profile
        </Link>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", margin: 0 }}>
          Manage & Customize Review QR Poster
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0 }}>
          Select from 5 predefined templates, customize your business details and colors, view live preview, and download your printable PNG posters.
        </p>
      </div>

      {/* QR Poster Customizer */}
      <QRPosterCustomizer
        initialConfig={initialConfig}
        onSave={saveQRCustomization}
        isPaid={true}
        showSaveButton={true}
      />
    </div>
  );
}
