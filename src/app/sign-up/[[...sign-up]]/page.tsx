import { SignUp } from "@clerk/nextjs";

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
