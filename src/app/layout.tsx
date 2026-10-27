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
  metadataBase: new URL('https://myrevlink.in'),
  title: 'MyRevLink — Link in Bio, Lead Forms & Simple CRM',
  description: 'Bring your services, content and client inquiries together. A link-in-bio page and simple lead management for coaches, creators, freelancers and astrology consultants.',
  openGraph: {
    title: 'MyRevLink — Your links. Your next opportunity.',
    description: 'Create your bio page, collect inquiries and organize your leads in one place.',
    url: 'https://myrevlink.in', siteName: 'MyRevLink', locale: 'en_US', type: 'website',
  },
  twitter: { card: 'summary', title: 'MyRevLink — Link in Bio & Lead Forms', description: 'Your services, content and client inquiries, together in one bio link.' },
  robots: { index: true, follow: true },
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
        "description": "A link-in-bio page with inquiry forms and simple lead management for independent professionals."

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

