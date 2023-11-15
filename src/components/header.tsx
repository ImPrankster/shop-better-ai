import Link from "next/link";

import { SignedIn, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[68px] w-screen items-center justify-stretch space-x-2 bg-secondary px-8 text-secondary-foreground">
      <Link
        href="/"
        className="col-span-1 flex place-content-start font-serif text-2xl font-bold"
      >
        ShopBetter. AI
      </Link>
      <div className="flex-1" />
      <div className="col-span-2 flex">
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            userProfileMode="navigation"
            userProfileUrl="/user-profile"
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
