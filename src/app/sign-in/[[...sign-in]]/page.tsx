import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | MyRevLink",
  description: "Sign in to your MyRevLink account and access your reputation management dashboard.",
};

export default function Page() {
  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh' }}>
      <SignIn 
        fallbackRedirectUrl="/dashboard" 
        forceRedirectUrl="/dashboard" 
        signUpFallbackRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
    </main>
  );
}
