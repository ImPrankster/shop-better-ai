import Link from "next/link";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

import { Input } from "./ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 grid h-[68px] w-screen grid-cols-7 justify-stretch space-x-2 bg-secondary px-8 text-secondary-foreground">
      <Link
        href="/"
        className="col-span-1 flex place-content-start items-center font-serif text-2xl font-bold"
      >
        ShopBetter. AI
      </Link>
      <div className="relative col-span-4 flex place-content-center items-center">
        <Search className="absolute left-2" color="#677489" />
        <Input
          className="rounded-full border-none bg-zinc-50 pl-10"
          placeholder="Search something..."
        />
      </div>
      <div className="col-span-2 flex place-content-end items-center">
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
