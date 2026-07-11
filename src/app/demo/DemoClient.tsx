"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/SubmitButton";
import { ShowcaseVideosEditor } from "@/components/ShowcaseVideosEditor";
import { ShowcaseAppsEditor } from "@/components/ShowcaseAppsEditor";
import { ShowcaseProductsEditor } from "@/components/ShowcaseProductsEditor";
import { CustomLinksEditor } from "@/components/CustomLinksEditor";
import { QRPosterSection } from "@/components/QRPosterSection";
import { ShowcaseTabs } from "@/components/ShowcaseTabs";
import { ContactSection } from "@/components/ContactSection";

interface AppItem {
  app_name?: string;
  app_description?: string;
  ios_link?: string;
  android_link?: string;
  web_link?: string;
}

interface ProductItem {
  name: string;
  price: string;
  url: string;
  image: string;
}

interface CustomLinkItem {
  title: string;
  url: string;
  image: string;
}

export default function DemoDashboard() {
  const formRef = useRef<HTMLFormElement>(null);

  // Live Simulator States
  const [businessName, setBusinessName] = useState("John's Pizza");
  const [description, setDescription] = useState(
    "The best brick-oven pizza in town. Made with fresh ingredients, local organic tomatoes, and lots of love since 1999."
  );
  const [googleReviewUrl, setGoogleReviewUrl] = useState("https://search.google.com/local/writereview?placeid=ChIJ1234567890Example");
  const [profilePhoto, setProfilePhoto] = useState("");
  
  const [facebook, setFacebook] = useState("johnspizza");
  const [instagram, setInstagram] = useState("johnspizza");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("johnspizza");
  const [linkedin, setLinkedin] = useState("");
  
  const [phone, setPhone] = useState("+1 555 123 4567");
  const [whatsapp, setWhatsapp] = useState("15551234567");
  const [email, setEmail] = useState("hello@johnspizza.com");
  const [bookingUrl, setBookingUrl] = useState("https://calendly.com/johnspizza");
  const [location, setLocation] = useState("123 Main St, New York, NY 10001");
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/?q=Johns+Pizza+New+York");

  const [themePrimary, setThemePrimary] = useState("#3b82f6");
  const [themeSecondary, setThemeSecondary] = useState("#8b5cf6");

  const [hideGoogleRate, setHideGoogleRate] = useState(false);
  const [hideShowcase, setHideShowcase] = useState(false);

  const [videos, setVideos] = useState<string[]>(["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]);
  const [apps, setApps] = useState<AppItem[]>([
    {
      app_name: "John's Pizza Delivery App",
      app_description: "Order your favorite pizzas directly from your phone and track delivery in real time!",
      ios_link: "https://apps.apple.com",
      android_link: "https://play.google.com",
      web_link: "https://order.johnspizza.com"
    }
  ]);
  const [products, setProducts] = useState<ProductItem[]>([
    {
      name: "Family Combo Box (Large Pizza + Sides)",
      price: "$29.99",
      url: "https://johnspizza.com/combo",
      image: ""
    }
  ]);
  const [customLinks, setCustomLinks] = useState<CustomLinkItem[]>([
    {
      title: "View Today's Pizza Menu",
      url: "https://johnspizza.com/menu",
      image: ""
    }
  ]);

  // Read Form data on change
  const handleFormChange = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    setBusinessName(formData.get("name") as string || "");
    setDescription(formData.get("description") as string || "");
    setGoogleReviewUrl(formData.get("google_review_url") as string || "");

    setInstagram(formData.get("instagram") as string || "");
    setFacebook(formData.get("facebook") as string || "");
    setTwitter(formData.get("twitter") as string || "");
    setYoutube(formData.get("youtube") as string || "");
    setLinkedin(formData.get("linkedin") as string || "");

    setPhone(formData.get("phone") as string || "");
    setWhatsapp(formData.get("whatsapp") as string || "");
    setEmail(formData.get("email") as string || "");
    setBookingUrl(formData.get("booking_url") as string || "");
    setLocation(formData.get("location") as string || "");
    setMapUrl(formData.get("map_url") as string || "");

    setThemePrimary(formData.get("theme_primary") as string || "#3b82f6");
    setThemeSecondary(formData.get("theme_secondary") as string || "#8b5cf6");

    setHideGoogleRate(formData.get("hide_google_rate") === "on");
    setHideShowcase(formData.get("hide_showcase") === "on");

    try {
      const videosJson = formData.get("showcase_videos") as string;
      if (videosJson) setVideos(JSON.parse(videosJson));
    } catch (e) {}

    try {
      const appsJson = formData.get("showcase_apps") as string;
      if (appsJson) setApps(JSON.parse(appsJson));
    } catch (e) {}

    try {
      const productsJson = formData.get("showcase_products") as string;
      if (productsJson) setProducts(JSON.parse(productsJson));
    } catch (e) {}

    try {
      const customLinksJson = formData.get("custom_links") as string;
      if (customLinksJson) setCustomLinks(JSON.parse(customLinksJson));
    } catch (e) {}
  };

  // Profile photo upload inside simulator
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Demo Changes Simulated! In the real app, these are instantly saved to the database.");
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
      {/* Top CTA Banner */}
      <div style={{
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        color: "white",
        padding: "1rem",
        textAlign: "center",
        fontWeight: 600,
        fontSize: "0.95rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        zIndex: 20,
        position: "relative"
      }}>
        <span>💡 <strong>Interactive Demo Mode:</strong> This is a live playground. Try editing details on the left, and watch the mobile preview update instantly!</span>
        <Link href="/sign-up">
          <Button variant="primary" style={{ background: "white", color: "#3b82f6", padding: "0.4rem 1rem", fontSize: "0.85rem", border: "none", fontWeight: 700 }}>
            Claim Your Custom Link
          </Button>
        </Link>
      </div>

      <div className="dashboard-layout-wrapper animate-fade-in" style={{ padding: "2rem 1.5rem" }}>
        {/* Left Original Dashboard Card */}
        <div className="dashboard-main-content">
          <div className="glass-card">
            
            <div className="dashboard-header">
              <h1 className="dashboard-title">Dashboard (Demo)</h1>
              <div className="dashboard-settings-btn" style={{ padding: "0.4rem 0.85rem", background: "rgba(0,0,0,0.05)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600 }}>
                <span>Demo Account</span>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h2 style={{ marginBottom: '1rem' }}>Welcome back, {businessName}!</h2>
              <p style={{ wordBreak: 'break-all', marginBottom: '1rem' }}>
                Your custom link: <strong><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{`myrevlink.in/b/johns-pizza`}</a></strong>
              </p>

              {/* Mobile preview hint */}
              <div className="mobile-preview-hint">
                💻 <strong>Tip:</strong> Log in on a desktop computer to view a live, real-time mobile mockup preview of your profile page!
              </div>

              {/* Printable QR Poster Component */}
              <QRPosterSection
                business={{ slug: "johns-pizza", name: businessName, google_review_url: googleReviewUrl }}
                socials={{ profile_photo: profilePhoto }}
              />

              {/* Business Settings Form */}
              <form
                ref={formRef}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', margin: 0 }}>Edit Business Profile</h3>
                
                <Input label="Business Name" name="name" defaultValue={businessName} required />
                <Input label="Custom Slug (cannot be changed)" name="slug_display" defaultValue="johns-pizza" disabled />
                
                <div className="input-group">
                  <label className="input-label">Description / Bio</label>
                  <textarea 
                    name="description" 
                    className="input-field"
                    defaultValue={description} 
                    rows={4}
                    placeholder="Tell customers about your business..."
                    style={{ 
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      outline: 'none',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Upload Profile Photo</label>
                  <input 
                    type="file" 
                    name="profile_photo" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="input-field"
                    style={{ 
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      outline: 'none',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }} 
                  />
                  {profilePhoto && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={profilePhoto} alt="Current profile" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Current Photo</span>
                    </div>
                  )}
                </div>

                <Input label="Google Review URL" name="google_review_url" defaultValue={googleReviewUrl} placeholder="https://search.google.com/local/writereview?placeid=..." />
                
                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>Social Media Links</h4>
                <Input label="Instagram URL / Username" name="instagram" defaultValue={instagram} placeholder="e.g. yourbusiness" />
                <Input label="Facebook URL / Username" name="facebook" defaultValue={facebook} placeholder="e.g. yourbusiness" />
                <Input label="YouTube URL / Username" name="youtube" defaultValue={youtube} placeholder="e.g. yourchannel" />
                <Input label="Twitter / X Username" name="twitter" defaultValue={twitter} placeholder="e.g. yourbusiness" />
                <Input label="LinkedIn URL / Username" name="linkedin" defaultValue={linkedin} placeholder="e.g. company/yourbusiness" />

                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>Showcase Section</h4>
                <div className="input-group">
                  <label className="input-label">Showcase Videos (YouTube/Instagram Links - max 5)</label>
                  <ShowcaseVideosEditor initialVideos={videos} />
                </div>

                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>App Promotion Links</h4>
                <div className="input-group">
                  <label className="input-label">App Store & Play Store URLs</label>
                  <ShowcaseAppsEditor initialApps={apps} />
                </div>

                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>Highlighted Products</h4>
                <div className="input-group">
                  <label className="input-label">Feature top products from your E-Commerce site</label>
                  <ShowcaseProductsEditor initialProducts={products} />
                </div>

                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>Custom Links (e.g. Website, Menu, Whatsapp Group, Catalog)</h4>
                <div className="input-group">
                  <label className="input-label">Add custom link cards (with custom icon/image) shown above other sections</label>
                  <CustomLinksEditor initialLinks={customLinks} />
                </div>
                
                <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>Location & Contact</h4>
                <Input label="Booking Link (Calendly, etc.)" name="booking_url" defaultValue={bookingUrl} placeholder="https://calendly.com/your-name" />
                <Input label="Physical Location" name="location" defaultValue={location} placeholder="123 Main St, City, Country" />
                <Input label="Google Maps URL" name="map_url" defaultValue={mapUrl} placeholder="https://maps.app.goo.gl/..." />
                <Input label="Contact Phone Number" name="phone" defaultValue={phone} placeholder="e.g. +1 234 567 8900" />
                <Input label="WhatsApp Number" name="whatsapp" defaultValue={whatsapp} placeholder="e.g. 1234567890 (Country code included)" />
                <Input label="Email Address" name="email" defaultValue={email} placeholder="contact@example.com" />
                
                <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>Profile Page Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: 0 }}>
                     <input type="checkbox" name="hide_google_rate" id="hide_google_rate" defaultChecked={hideGoogleRate} style={{ width: '1.2rem', height: '1.2rem' }} />
                     <label htmlFor="hide_google_rate" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                       <strong>Hide "Rate us on Google" button</strong> <br/>
                       <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>If checked, the primary glowing "Rate us on Google" action button will be hidden on your profile page.</span>
                     </label>
                   </div>
                   
                   <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: 0 }}>
                     <input type="checkbox" name="hide_showcase" id="hide_showcase" defaultChecked={hideShowcase} style={{ width: '1.2rem', height: '1.2rem' }} />
                     <label htmlFor="hide_showcase" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                       <strong>Hide Showcase section</strong> <br/>
                       <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>If checked, the Showcase tab section (Videos, Apps, Products) will be hidden on your profile page.</span>
                     </label>
                   </div>
                </div>

                <h4 style={{ marginTop: '1rem', color: 'var(--muted)' }}>AI Review Settings</h4>
                <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <input type="checkbox" name="always_positive" id="always_positive" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
                  <label htmlFor="always_positive" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    <strong>Optimize for positive drafts</strong> <br/>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>If checked, the AI pre-fills a positive review draft to encourage customer feedback, while still allowing manual edits.</span>
                  </label>
                </div>
                
                <h4 style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>Brand Colors</h4>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label className="input-label">Primary Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" name="theme_primary" defaultValue={themePrimary} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Main buttons and accents</span>
                    </div>
                  </div>
                  <div className="input-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label className="input-label">Secondary Color (Optional)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" name="theme_secondary" defaultValue={themeSecondary} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Used for beautiful gradients</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <SubmitButton>Save Changes (Simulated)</SubmitButton>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* Right Live Preview Column */}
        <div className="dashboard-preview-panel">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.875rem" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
              <span>Live Preview</span>
            </div>

            {/* Phone Mockup Frame */}
            <div className="phone-frame" style={{ zIndex: 1 }}>
              <div className="phone-notch" />
              
              {/* Profile Screen Simulator */}
              <div style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                background: "var(--background)",
                padding: "4rem 1.5rem 2rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                position: "relative",
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                "--primary": themePrimary,
                "--accent": themeSecondary
              } as React.CSSProperties} className="hide-scrollbar">
                
                {/* Background Blobs inside simulator */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, ${themePrimary} 15%, transparent) 0%, transparent 50%), radial-gradient(circle at 100% 100%, color-mix(in srgb, ${themeSecondary} 10%, transparent) 0%, transparent 50%)`,
                  zIndex: 0,
                  pointerEvents: "none"
                }} />

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%" }}>
                  {/* Avatar */}
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%', 
                    background: `linear-gradient(135deg, ${themePrimary}, ${themeSecondary})`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '3.5rem', color: 'white', fontWeight: 'bold', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}>
                    {profilePhoto ? (
                      <img src={profilePhoto} alt={businessName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      businessName.charAt(0).toUpperCase() || "?"
                    )}
                  </div>

                  {/* Title */}
                  <h1 style={{ fontSize: '1.75rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center' }}>
                    {businessName}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={themePrimary} style={{ marginTop: '4px' }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </h1>

                  {/* Social Media Horizontal Icons Section */}
                  {(youtube || facebook || instagram || linkedin || twitter) && (
                    <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
                      {youtube && (
                        <a href="#" onClick={(e) => e.preventDefault()} title="YouTube" className="social-icon-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
                      {facebook && (
                        <a href="#" onClick={(e) => e.preventDefault()} title="Facebook" className="social-icon-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>
                      )}
                      {instagram && (
                        <a href="#" onClick={(e) => e.preventDefault()} title="Instagram" className="social-icon-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#ig-grad)">
                            <defs>
                              <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f09433" />
                                <stop offset="25%" stopColor="#e6683c" />
                                <stop offset="50%" stopColor="#dc2743" />
                                <stop offset="75%" stopColor="#cc2366" />
                                <stop offset="100%" stopColor="#bc1888" />
                              </linearGradient>
                            </defs>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.049 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.899 1.113 1.153 1.772.248.639.416 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.049 1.065-.217 1.79-.465 2.428-.254.66-.598 1.216-1.153 1.772-.556.555-1.113.899-1.772 1.153-.639.248-1.363.416-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.049-1.79-.217-2.428-.465-.66-.254-1.216-.598-1.772-1.153-.555-.556-.899-1.113-1.153-1.772-.248-.639-.416-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.049-1.065.217-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.556-.555 1.113-.899 1.772-1.153.639-.248 1.363-.416 2.428-.465C8.944 2.01 9.283 2 12 2zm0 2.16c-2.67 0-2.996.01-4.048.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.052-.058 1.378-.058 4.048 0 2.67.01 2.996.058 4.048.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.052.048 1.378.058 4.048.058 2.67 0 2.996-.01 4.048-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.052.058-1.378.058-4.048 0-2.67-.01-2.996-.058-4.048-.045-.975-.207-1.504-.344-1.857-.182-.467-.398-.8-.748-1.15-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857C14.996 4.17 14.67 4.16 12 4.16zm0 2.678a5.162 5.162 0 100 10.324 5.162 5.162 0 000-10.324zm0 8.164a3.002 3.002 0 110-6.004 3.002 3.002 0 010 6.004zm3.41-7.422a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                          </svg>
                        </a>
                      )}
                      {twitter && (
                        <a href="#" onClick={(e) => e.preventDefault()} title="Twitter (X)" className="social-icon-btn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {linkedin && (
                        <a href="#" onClick={(e) => e.preventDefault()} title="LinkedIn" className="social-icon-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Contact Info Section */}
                  <ContactSection phone={phone} whatsapp={whatsapp} email={email} />

                  {/* Bio */}
                  {description && (
                    <p style={{ color: 'var(--secondary-foreground)', fontSize: '1rem', lineHeight: '1.5', textAlign: 'center', margin: '0.25rem 0', width: '100%' }}>
                      {description}
                    </p>
                  )}

                  {/* Physical Location Address & Google Maps */}
                  {(location || mapUrl) && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: '0', width: '100%' }}>
                      {location && (
                        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          📍 {location}
                        </p>
                      )}
                      {mapUrl && (
                        <a 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          style={{ 
                            color: 'var(--primary)', 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            textDecoration: 'none', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)'
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                  )}

                  {/* Primary Action Button (Glowing) */}
                  {googleReviewUrl && !hideGoogleRate && (
                    <div style={{ width: '100%', marginTop: '1rem' }}>
                       <a href="#" onClick={(e) => e.preventDefault()} style={{ width: '100%', display: 'block' }}>
                         <div className="glass-card primary-card" style={{ 
                            gap: '0.75rem', padding: '1.5rem', 
                            background: `linear-gradient(90deg, ${themePrimary}, ${themeSecondary})`,
                            boxShadow: `0 10px 25px -5px color-mix(in srgb, ${themePrimary} 50%, transparent)`,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: 'var(--radius-lg)'
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fbbf24' }}>
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            <span style={{ fontSize: '1.125rem' }}>Rate us on Google</span>
                         </div>
                       </a>
                    </div>
                  )}

                  {/* Book Appointment Action Button */}
                  {bookingUrl && (
                    <div style={{ width: '100%', marginTop: '0.5rem' }}>
                       <a href="#" onClick={(e) => e.preventDefault()} style={{ width: '100%', display: 'block' }}>
                         <div className="glass-card primary-card" style={{ 
                            gap: '0.75rem', padding: '1.25rem', 
                            background: 'var(--foreground)',
                            color: 'var(--background)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-lg)'
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Book Appointment</span>
                         </div>
                       </a>
                    </div>
                  )}

                  {/* Custom Links Cards */}
                  {customLinks.length > 0 && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0.25rem" }}>
                        <h3 style={{ fontSize: "1.125rem", margin: 0, fontWeight: 600 }}>Links</h3>
                      </div>
                      {customLinks.map((link, index) => {
                        if (!link.title) return null;
                        return (
                          <a key={index} href="#" onClick={(e) => e.preventDefault()} style={{ width: "100%", display: "block", textDecoration: "none" }}>
                            <div className="custom-link-card">
                              {link.image ? (
                                <img src={link.image} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                              ) : (
                                <div style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: `color-mix(in srgb, ${themePrimary} 10%, transparent)`,
                                  color: themePrimary,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                  </svg>
                                </div>
                              )}
                              <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", flex: 1 }}>{link.title}</span>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Showcase Sections */}
                  {!hideShowcase && (
                    <ShowcaseTabs
                      videos={videos}
                      apps={apps}
                      products={products}
                    />
                  )}

                  {/* Footer */}
                  <div style={{ display: "block", textAlign: "center", width: "100%", marginTop: "3rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Powered by <strong style={{ color: "var(--foreground)" }}>MyRevLink</strong></span>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>Bio link and Google Review Generator</span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
