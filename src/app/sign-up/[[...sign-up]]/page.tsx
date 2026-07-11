import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | MyRevLink",
  description: "Create your MyRevLink account and start automating your local Google Reviews today.",
};

export default function Page() {
  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh' }}>
      <SignUp 
        fallbackRedirectUrl="/dashboard" 
        forceRedirectUrl="/dashboard" 
        signInFallbackRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
      />
    </main>
  );
}
