"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

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
          // Limit wallet-related UIs to Solana only
          walletChainType: "solana-only",
        },
        // Create embedded Solana wallets for users who don't already have a wallet
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Enable popular Solana browser wallets (desktop & mobile)
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
