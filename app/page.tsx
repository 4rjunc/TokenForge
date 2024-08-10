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
import Image from "next/image";
import { Button } from "pixel-retroui";
import CreateMint from "./components/CreateMint";
import { Bubble } from "pixel-retroui";

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
        <nav className="rounded-xl h-full w-full bg-red-500  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100">
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
            <Image width="100" height="100" src="/nyancat.gif" alt="nyancat" />
            <Bubble direction="left">
              {publicKey ? <BalanceDisplay /> : <p>Connect to wallet</p>}
            </Bubble>
          </div>
        </nav>
      </div>
      <div className="flex flex-col items-center mt-2">
        <p className="font-bold text-2xl mb-2">create spl-token!</p>
        <Button className="mb-4" onClick={handleWalletAction}>
          <span className="text-xl">
            {" "}
            {publicKey ? `${publicKey.toBase58()}` : "Connect Wallet 💳"}
          </span>
        </Button>
      </div>
      {publicKey && (
        <div>
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
