import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import type { Metadata } from "next";

// Define the industry metadata database
interface IndustryData {
  title: string;
  name: string;
  emoji: string;
  heroTitle: string;
  heroSub: string;
  statText: string;
  useCase1Title: string;
  useCase1Desc: string;
  useCase2Title: string;
  useCase2Desc: string;
  useCase3Title: string;
  useCase3Desc: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
}

const industriesMap: Record<string, IndustryData> = {
  dentists: {
    title: "Google Review Generator for Dentists & Dental Clinics",
    name: "Dentists",
    emoji: "🦷",
    heroTitle: "Build Trust & Fill Your Chairs with 5-Star Dental Reviews.",
    heroSub: "Most patients choose a dentist based on Google reviews. MyRevLink lets your patients write and publish perfect 5-star reviews in under 15 seconds.",
    statText: "94% of patients read online reviews before choosing a new dentist.",
    useCase1Title: "Counter QR Codes",
    useCase1Desc: "Place our beautiful QR stand at the checkout counter. Patients scan and review before leaving the clinic.",
    useCase2Title: "AI-Written Patient Reviews",
    useCase2Desc: "Our AI helps patients write authentic reviews mentioning 'painless', 'professional', or 'friendly staff' automatically.",
    useCase3Title: "100% Google Compliant",
    useCase3Desc: "Pure organic reviews generated directly from patients' personal mobile devices and Google accounts.",
    faqQ1: "Can I use this for multiple dentists in the same clinic?",
    faqA1: "Yes, you can direct patients to a unified clinic landing page, or create separate links for each dentist to build their individual professional profiles.",
    faqQ2: "Does it help my local map ranking?",
    faqA2: "Absolutely! Fresh, keyword-rich dental reviews (e.g. 'root canal', 'teeth whitening') signal to Google that your clinic is active and trusted, boosting your local Map pack placement."
  },
  restaurants: {
    title: "Google Review Generator for Restaurants, Cafes & Bars",
    name: "Restaurants & Cafes",
    emoji: "🍔",
    heroTitle: "Turn Hungry Diners into 5-Star Google Reviews.",
    heroSub: "Climb the local food rankings. Let customers scan table tent QR codes to write verified reviews about your food, service, and ambiance in one tap.",
    statText: "Restaurants with 4.5+ stars get 3x more bookings on weekend nights.",
    useCase1Title: "Table Tent QR Codes",
    useCase1Desc: "Generate table-specific or main counter QR codes. Diners scan, rate, and publish reviews while waiting for the bill.",
    useCase2Title: "Highlight Signature Dishes",
    useCase2Desc: "Prompt diners with AI-generated reviews talking about your best dishes, boosting local keyword rankings.",
    useCase3Title: "Zero Monthly Fees",
    useCase3Desc: "Pay once and get lifetime review automation. No subscriptions eating into your restaurant margins.",
    faqQ1: "Can we link this to our digital menu?",
    faqA1: "Yes! You can add your digital menu link, reservation system, or Instagram profile right onto your custom MyRevLink business page.",
    faqQ2: "Is it easy for staff to use?",
    faqA2: "Staff don't need to do anything. Simply print the auto-generated QR code card, place it in a prominent spot, and watch reviews roll in."
  },
  "real-estate": {
    title: "Google Review Generator for Real Estate Agents & Brokers",
    name: "Real Estate",
    emoji: "🏡",
    heroTitle: "Win More Listings with a Five-Star Digital Reputation.",
    heroSub: "Home buyers and sellers want trusted agents. Automatically request Google reviews at closing, and display your active property listings in one place.",
    statText: "88% of buyers recommend their agent or use them again if they have strong reviews.",
    useCase1Title: "Closing Gift QR Code",
    useCase1Desc: "Add a review QR code to your closing packet or gift box. Clients scan to share their home buying journey.",
    useCase2Title: "Showcase Your Listings",
    useCase2Desc: "Include active Zillow links, personal website, and video walk-throughs on your central profile page.",
    useCase3Title: "Text Link Request",
    useCase3Desc: "Send a friendly text link directly to your client's WhatsApp or iMessage right after keys are handed over.",
    faqQ1: "Can I show my video property tours?",
    faqA1: "Yes, our digital profile tabs let you showcase YouTube walk-throughs, listings, and your agent biography page.",
    faqQ2: "How does it help SEO for agents?",
    faqA2: "Google ranks local agents based on active review velocity. Getting consistent 5-star reviews on Google Maps guarantees you appear when buyers search 'real estate agent near me'."
  },
  "hair-salons": {
    title: "Google Review Generator for Hair Salons, Spas & Barbers",
    name: "Salons & Spas",
    emoji: "✂️",
    heroTitle: "Skyrocket Salon Bookings with 5-Star Client Reviews.",
    heroSub: "Your clients leave looking beautiful—now make sure your Google profile looks just as good. Get more reviews for cuts, colors, and treatments automatically.",
    statText: "92% of consumers trust reviews with photos when picking a stylist or spa.",
    useCase1Title: "Mirror QR Placements",
    useCase1Desc: "Place small, elegant QR code stickers on styling station mirrors. Clients scan while their color sets or after their cut.",
    useCase2Title: "AI Style Prompts",
    useCase2Desc: "Our AI helps clients draft reviews detailing the specific service they got (e.g. 'balayage', 'fade', 'facial').",
    useCase3Title: "Integrated Booking",
    useCase3Desc: "Put your Fresha, Vagaro, or custom booking link directly on your review profile for seamless conversions.",
    faqQ1: "Can my individual stylists have their own links?",
    faqA1: "Absolutely! You can set up unique MyRevLink URLs for each stylist so they can build their own clientele and track reviews.",
    faqQ2: "Is there a limit on how many clients can scan?",
    faqA2: "No limits whatsoever. Your lifetime license grants unlimited scans, unlimited clicks, and unlimited AI review generations."
  },
  plumbers: {
    title: "Google Review Generator for Plumbers & Home Services",
    name: "Plumbers & HVAC",
    emoji: "🔧",
    heroTitle: "Get More Local Plumbing Jobs with 5-Star Reviews.",
    heroSub: "In home services, trust is everything. Send review requests via text message immediately after finishing a job, and dominate local Google Map searches.",
    statText: "Local service businesses with 100+ reviews receive 4x more inbound calls.",
    useCase1Title: "On-the-Job Texting",
    useCase1Desc: "Send a quick SMS review request link to the homeowner as you Pack up. They can review you in 3 clicks.",
    useCase2Title: "AI Keywords for Services",
    useCase2Desc: "Get reviews that mention specific plumbing keywords like 'clogged drain', 'water heater replacement', or 'emergency plumber'.",
    useCase3Title: "Emergency Trust Signals",
    useCase3Desc: "Showcase your quick response times, emergency contact buttons, and licensing details in one hub.",
    faqQ1: "Can dispatchers send the link?",
    faqA1: "Yes, dispatchers can text or email your MyRevLink URL to customers right after the technician marks the job complete.",
    faqQ2: "Do reviews help against negative feedback?",
    faqA2: "By building a steady, daily stream of positive 5-star reviews from happy clients, occasional negative reviews will be buried and won't affect your overall score."
  },
  gyms: {
    title: "Google Review Generator for Gyms, Studios & Trainers",
    name: "Gyms & Fitness",
    emoji: "💪",
    heroTitle: "Build Fitness Authority with Member Google Reviews.",
    heroSub: "Motivate new members to join. Capture 5-star feedback from your current gym members, personal training clients, and class attendees instantly.",
    statText: "85% of people search for local gyms and class reviews before signing up.",
    useCase1Title: "Check-in Desk QR",
    useCase1Desc: "Display the QR code prominently at your front desk check-in. Members scan to support their community.",
    useCase2Title: "Class Finish Reminders",
    useCase2Desc: "Encourage trainers to ask class members to scan the code right after a high-energy workout finishes.",
    useCase3Title: "Schedule & Pricing Links",
    useCase3Desc: "Host your class schedules, membership sign-up forms, and trainer bios directly on your profile.",
    faqQ1: "Can we run a monthly review challenge?",
    faqA1: "Yes! Gyms often use MyRevLink to run member giveaways, rewarding members who scan and post a review with a free shake or gym merch.",
    faqQ2: "Does it support multiple gym locations?",
    faqA2: "You can purchase a license for each location to route members to the exact Google Maps profile for their home gym branch."
  },
  lawyers: {
    title: "Google Review Generator for Lawyers & Law Firms",
    name: "Lawyers & Law Firms",
    emoji: "⚖️",
    heroTitle: "Attract High-Value Cases with 5-Star Client Reviews.",
    heroSub: "Google Map placement is the highest-converting marketing channel for attorneys. Collect reviews professionally and securely at case resolution.",
    statText: "82% of clients check online reviews before hiring a lawyer or law firm.",
    useCase1Title: "Professional Link Sharing",
    useCase1Desc: "Share your dedicated review URL in your final closing email or letter when a client's case is successfully resolved.",
    useCase2Title: "AI Review Assistant",
    useCase2Desc: "Clients draft detailed, professional reviews mentioning specific terms like 'professional counsel', 'supportive', and 'great communication'.",
    useCase3Title: "Secure and Compliant",
    useCase3Desc: "Google-compliant flow that honors client confidentiality. No tracking scripts or user data storage.",
    faqQ1: "Is this compliant with state bar association rules?",
    faqA1: "Yes, MyRevLink acts strictly as a directory link routing tool that simplifies navigation. It does not incentivize reviews or manipulate content.",
    faqQ2: "Can we link to our case evaluation form?",
    faqA2: "Yes, you can host your booking calendar or case evaluation questionnaire directly on your custom links tab."
  },
  contractors: {
    title: "Google Review Generator for General Contractors & Builders",
    name: "Contractors",
    emoji: "🔨",
    heroTitle: "Win Bigger Remodeling & Construction Projects.",
    heroSub: "Homeowners hire contractors they can trust. Build an unmatched digital presence by automating Google reviews on every job site.",
    statText: "97% of homeowners read reviews of general contractors before requesting quotes.",
    useCase1Title: "Yard Sign QR Codes",
    useCase1Desc: "Add your review QR code to your job site yard signs. Neighbors scan to view your work and leave reviews.",
    useCase2Title: "Showcase Completed Projects",
    useCase2Desc: "Upload before-and-after photo galleries and link your Instagram profile directly on your card.",
    useCase3Title: "SMS Review Followups",
    useCase3Desc: "Send simple follow-up texts directly to homeowners' phones during final walk-throughs.",
    faqQ1: "Can we upload portfolio photos?",
    faqA1: "Yes, you can link directly to your portfolio, Houzz profile, or project galleries via the custom showcase tabs.",
    faqQ2: "How fast can I get reviews?",
    faqA2: "You can generate reviews instantly. Once you share the link, customers can submit their feedback in under a minute."
  },
  doctors: {
    title: "Google Review Generator for Doctors & Medical Clinics",
    name: "Doctors & Clinics",
    emoji: "🏥",
    heroTitle: "Enhance Clinic Reputation & Build Patient Trust.",
    heroSub: "Patient care extends online. Collect feedback from patients easily and professionally, and improve your medical practice discoverability.",
    statText: "90% of patients use online reviews to evaluate a physician or clinic.",
    useCase1Title: "Waiting Room Placards",
    useCase1Desc: "Place subtle, professional placards in your lobby. Patients scan to provide feedback during check-out.",
    useCase2Title: "Patient Portal Integration",
    useCase2Desc: "Add your review link to your standard appointment checkout portal or follow-up email templates.",
    useCase3Title: "Confidential and HIPAA Safe",
    useCase3Desc: "No patient information or medical history is ever requested, processed, or saved by MyRevLink.",
    faqQ1: "Is there any patient data tracked?",
    faqA1: "No. MyRevLink is a privacy-first router. No patient names, phone numbers, or health histories are stored on our servers.",
    faqQ2: "Does this replace internal feedback?",
    faqA2: "It complements it. You can place links for direct private feedback alongside the Google review button."
  },
  hotels: {
    title: "Google Review Generator for Hotels, Motels & Lodges",
    name: "Hotels & Lodging",
    emoji: "🏨",
    heroTitle: "Increase Room Bookings with Constant 5-Star Reviews.",
    heroSub: "Climb the TripAdvisor and Google Travel rankings. Let guests scan QR codes in the lobby, keycards, or rooms to review their stay in seconds.",
    statText: "A 0.5-star rating increase on Google raises hotel room pricing power by 11%.",
    useCase1Title: "Keycard & Room Placement",
    useCase1Desc: "Add QR codes to keycard holders, in-room guest guides, or table tents inside the rooms.",
    useCase2Title: "Checkout Lobby Stand",
    useCase2Desc: "Encourage guests to scan and leave reviews at checkout when front desk staff ask how their stay was.",
    useCase3Title: "Booking & Amenities Hub",
    useCase3Desc: "Provide links to room service, spa booking, and direct reservation systems on the same page.",
    faqQ1: "Can we link to TripAdvisor as well?",
    faqA1: "Yes, you can list your TripAdvisor page, Booking.com profile, and Airbnb listing all on your MyRevLink dashboard.",
    faqQ2: "Does this work in guest rooms?",
    faqA2: "Perfectly. Guests connect to your room Wi-Fi, scan the QR code in their room guide, and submit their review instantly."
  }
};

export async function generateMetadata(
  props: { params: Promise<{ industry: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const { industry } = params;
  const data = industriesMap[industry];

  if (!data) {
    return {
      title: "Industry SEO Solutions | MyRevLink",
    };
  }

  return {
    title: `${data.title} - MyRevLink`,
    description: data.heroSub,
    keywords: ["Google reviews", "local SEO", data.name, "review generator", "get reviews"],
  };
}

export default async function IndustryPage(props: { params: Promise<{ industry: string }> }) {
  const params = await props.params;
  const { industry } = params;
  const data = industriesMap[industry];

  if (!data) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.heroSub,
    "url": `https://myrevlink.in/industries/${industry}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "MyRevLink",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "30.00",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#ffffff", overflowX: "hidden" }}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* NAVBAR */}
      <header className="container header-nav" style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#172554' }}>MyRevLink</span>
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/sign-in" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4b5563", textDecoration: "none" }}>Login</Link>
          <Link href="/sign-up">
            <Button variant="primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: "8px", background: "#1d4ed8" }}>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ position: "relative", padding: "8rem 1.5rem 4rem 1.5rem", background: "linear-gradient(135deg, #eff4ff 0%, #ffffff 100%)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{data.emoji}</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 850, color: "#0f172a", lineHeight: 1.2, marginBottom: "1.5rem" }}>
            {data.heroTitle}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#475569", lineHeight: 1.6, marginBottom: "2.5rem" }}>
            {data.heroSub}
          </p>

          <div style={{ background: "#e0e7ff", color: "#3730a3", display: "inline-flex", padding: "0.75rem 1.5rem", borderRadius: "9999px", fontWeight: 600, fontSize: "0.95rem", marginBottom: "2.5rem" }}>
            💡 {data.statText}
          </div>

          <div>
            <Link href="/sign-up">
              <Button variant="primary" style={{ padding: "1.25rem 2.5rem", fontSize: "1.125rem", borderRadius: "8px", background: "#3b82f6", boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)" }}>
                Start Automating Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section style={{ padding: "5rem 1.5rem", background: "#ffffff" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem", color: "#0f172a" }}>
            Designed Specifically for {data.name}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div style={{ padding: "2.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>{data.useCase1Title}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{data.useCase1Desc}</p>
            </div>
            <div style={{ padding: "2.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>{data.useCase2Title}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{data.useCase2Desc}</p>
            </div>
            <div style={{ padding: "2.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>{data.useCase3Title}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{data.useCase3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED FAQ */}
      <section style={{ padding: "5rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem", color: "#0f172a" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>{data.faqQ1}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{data.faqA1}</p>
            </div>
            <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>{data.faqQ2}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>{data.faqA2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <div className="container" style={{ padding: "3rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Image src="/logo.png" alt="MyRevLink Logo" width={24} height={24} style={{ objectFit: 'contain' }} />
            <span style={{ fontWeight: "bold", color: "#0f172a" }}>MyRevLink</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
            <Link href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</Link>
            <Link href="/privacy-policy" style={{ color: "#475569", textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms-and-conditions" style={{ color: "#475569", textDecoration: "none" }}>Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
