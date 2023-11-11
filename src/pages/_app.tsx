import { type AppType } from "next/app";
import { Albert_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { api } from "~/utils/api";

import "../styles/globals.css";

const albert_Sans = Albert_Sans({
  subsets: ["latin-ext"],
  variable: "--font-albert-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${albert_Sans.variable} font-sans`}>
      <ClerkProvider
        {...pageProps}
        appearance={{
          variables: {
            colorPrimary: "#4c1d95",
            fontFamily: "__Albert_Sans_b1f339, __Albert_Sans_Fallback_b1f339",
          },
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>
      <Analytics />
    </div>
  );
};

export default api.withTRPC(MyApp);
