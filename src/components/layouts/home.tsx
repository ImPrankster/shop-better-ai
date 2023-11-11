import { type ReactElement } from "react";

import { type Metadata } from "next";
import Head from "next/head";

import Header from "~/components/header";

export const metadata: Metadata = {
  title: "ShopBetter AI.",
  description: "A different shopping experience",
};

const HomeLayout = ({ children }: { children: ReactElement | null }) => {
  return (
    <>
      <Head>
        <title>ShopBetter AI.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen w-screen flex-col items-center">
        <Header />
        {children}
      </div>
    </>
  );
};

export default HomeLayout;
