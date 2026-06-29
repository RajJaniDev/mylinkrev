import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh' }}>
      <SignIn fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" />
    </main>
  );
}
