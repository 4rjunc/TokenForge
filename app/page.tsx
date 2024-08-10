"use client";
import { useState } from "react";

//for wallet connection
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

//components for mind actions
import BalanceDisplay from "./components/BalanceDisplay";
import CreateTokenAccount from "./components/CreateTokenAccount";
import MintToken from "./components/MintToken";
import TokenBalanace from "./components/TokenBalanace";
import TransferToken from "./components/TransferToken";
import BurningToken from "./components/BurningToken";
import DelegationToken from "./components/DelegationToken";

//ui components
import { Button } from "pixel-retroui";
import CreateMint from "./components/CreateMint";

export default function Home() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mintAddress, setMintAddress] = useState<string | null>(null);

  const handleWalletAction = () => {
    if (publicKey) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const handleMintCreated = (address: string) => {
    setMintAddress(address);
  };

  return (
    <main className="font-minecraft ">
      <div className="p-2">
        <nav className="rounded-xl border-gray-200 bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a
              href="https://github.com/4rjunc"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://cryptologos.cc/logos/solana-sol-logo.svg"
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                Token Forge
              </span>
            </a>

            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <div className="border border-white-900 p-2 rounded">
                <BalanceDisplay />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex flex-col items-center mt-2">
        <p className="font-semibold">token forge ⚔️ to create spl-token!</p>
        <Button className="mt-1" onClick={handleWalletAction}>
          {publicKey
            ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
            : "Connect Wallet 💳"}
        </Button>
      </div>
      {publicKey && (
        <div>
          <BalanceDisplay />
          {!mintAddress ? (
            <div>
              <CreateMint onMintCreated={handleMintCreated} />
            </div>
          ) : (
            <div className="flex flex-col justify-evenly items-center h-screen">
              <CreateTokenAccount />
              <TokenBalanace />
              <MintToken />
              <TransferToken />
              <BurningToken />
              <DelegationToken />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
