"use client";

import { useMemo, useEffect } from "react";
import { PublicKey, Transaction, Connection, clusterApiUrl } from "@solana/web3.js";
import { usePrivy } from "@privy-io/react-auth";
import { useSolanaWallets, useSendTransaction } from "@privy-io/react-auth/solana";
import React from "react";

/**
 * Compatibility hooks that mimic the API of `@solana/wallet-adapter-react`
 * but underneath use Privy's React SDK.
 */

export function useConnection() {
  const connection = useMemo(() => new Connection(clusterApiUrl("devnet")), []);
  return { connection };
}

export function useWallet() {
  const { login, logout, authenticated } = usePrivy();

  // --- Phantom Android in-app browser fix --------------------------------
  useEffect(() => {
    if (authenticated) {
      if (typeof window !== "undefined") {
        const ua = navigator.userAgent || "";
        const isAndroid = /Android/i.test(ua);
        const isPhantom = /Phantom/i.test(ua);
        if (isAndroid && isPhantom) {
          const intentUrl =
            `intent://${location.host}${location.pathname}${location.search}` +
            `#Intent;scheme=https;package=app.vercel.token_forge_delta.twa;end`;
          window.location.href = intentUrl;
        }
      }
    }
  }, [authenticated]);
  const { wallets } = useSolanaWallets();
  const { sendTransaction } = useSendTransaction();

  const connectedWallet = wallets.length > 0 ? wallets[0] : undefined;

  const connect = () => {
    if (!authenticated) login();
  };

  const disconnect = () => {
    if (authenticated) logout();
  };

  return {
    publicKey: connectedWallet ? new PublicKey(connectedWallet.address) : null,
    connected: authenticated,
    connect,
    disconnect,
    sendTransaction: async (transaction: Transaction, connection: Connection) => {
      const receipt = await sendTransaction({ transaction, connection });
      // @ts-ignore Privy types may evolve
      return receipt?.signature ?? receipt;
    },
  };
}

export function useWalletModal() {
  const { login } = usePrivy();
  return {
    setVisible: (value: boolean) => {
      if (value) login();
    },
  };
}

export const WalletMultiButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...rest
}) => {
  const { connected, connect, disconnect } = useWallet();
  const label = children ?? (connected ? "Disconnect" : "Connect Wallet");

  return (
    <button {...rest} onClick={connected ? disconnect : connect}>
      {label}
    </button>
  );
};
