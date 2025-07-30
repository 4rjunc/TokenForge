"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

/**
 * Top-level provider wiring Privy into the Next.js app.
 *
 * For the Privy dashboard, generate an application and copy its `APP_ID`
 * into an environment variable named `NEXT_PUBLIC_PRIVY_APP_ID`.
 */
export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    // eslint-disable-next-line no-console
    console.warn(
      "Privy APP_ID env-var missing – set NEXT_PUBLIC_PRIVY_APP_ID in your env to enable wallet connectivity.",
    );
  }

  return (
    <PrivyProvider
      appId={appId ?? ""}
      config={{
        appearance: {
          walletChainType: "solana-only",
        },
        loginMethods: ["wallet"],
        embeddedWallets: { createOnLogin: "users-without-wallets" },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
