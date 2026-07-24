import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyRevLink - Get 5-Star Google Reviews Effortlessly",
  description: "The #1 AI-powered tool for local businesses. Generate SEO-friendly Google Reviews instantly, capture more leads, and rank higher on local search.",
  keywords: ["Google reviews", "local SEO", "reputation management", "AI review generator", "small business tools"],
  openGraph: {
    title: "MyRevLink | Dominate Local Search",
    description: "Generate 5-star Google reviews in one tap using our AI magic. Perfect for local businesses looking to boost their local SEO.",
    url: "https://myrevlink.in",
    siteName: "MyRevLink",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyRevLink - Skyrocket Your Google Reviews",
    description: "Get a custom, mobile-friendly link that lets your customers generate perfect 5-star reviews in one tap.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://myrevlink.in/#software",
        "name": "MyRevLink",
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "30.00",
          "priceCurrency": "USD",
          "priceValidUntil": "2027-12-31"
        },
        "description": "Generate 5-star Google reviews in one tap using our AI magic. Perfect for local businesses looking to boost their local SEO."
      },
      {
        "@type": "Organization",
        "@id": "https://myrevlink.in/#organization",
        "name": "MyRevLink",
        "url": "https://myrevlink.in",
        "logo": "https://myrevlink.in/logo.png",
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://myrevlink.in/#website",
        "url": "https://myrevlink.in",
        "name": "MyRevLink",
        "publisher": {
          "@id": "https://myrevlink.in/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://myrevlink.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the AI review generator work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When a customer scans your QR code or visits your profile link, they select their star rating. Our AI then drafts a context-aware, positive review based on your business description, which the customer can copy and paste to Google with one tap."
            }
          },
          {
            "@type": "Question",
            "name": "Is MyRevLink really a one-time purchase?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Our launch promotion provides lifetime access to all core features—including your custom business profile, Linktree-style URL routing, AI review generation, and Leads CRM—for a single one-time payment."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize the fields on my lead capture form?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely. You can customize form fields, set validations, enable email notifications, and view all captured contacts directly within your private CRM dashboard."
            }
          }
        ]
      }
    ]
  };

  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning>
          {/* Global Product Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLdGraph).replace(/</g, '\\u003c'),
            }}
          />
          {gaId && (
            <>
              {/* Google Analytics Script */}
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          )}
          <div className="gradient-bg"></div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

