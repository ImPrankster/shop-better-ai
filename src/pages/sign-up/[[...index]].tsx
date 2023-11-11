import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-screen flex-col place-content-center place-items-center">
      <SignUp />
    </main>
  );
}
