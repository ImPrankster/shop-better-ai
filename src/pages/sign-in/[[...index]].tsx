import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex h-screen w-screen flex-col place-content-center place-items-center bg-secondary">
      <SignIn />
    </main>
  );
}
