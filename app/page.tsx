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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "pixel-retroui";

export default function Home() {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [decimal, setDecimal] = useState<number>(0);

  const handleWalletAction = () => {
    if (publicKey) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const handleMintCreated = (address: string, decimal: number) => {
    setMintAddress(address);
    setDecimal(decimal);
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
                className="h-20 w-20"
                alt="solana Logo"
              />
              <span className="self-center text-4xl font-semibold whitespace-nowrap text-white">
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
            <div className="w-full flex flex-col items-center gap-10 px-48 justify-center">
              <TokenBalanace mintAddress={mintAddress} decimal={decimal} />
              <Accordion
                bg="#ddceb4"
                textColor="#30210b"
                borderColor="#30210b"
                shadowColor="#30210b"
              >
                <AccordionItem value="cta">
                  <AccordionTrigger>Create Token Account</AccordionTrigger>
                  <AccordionContent>
                    <CreateTokenAccount mintAddress={mintAddress} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mintToken">
                  <AccordionTrigger>Mint Token</AccordionTrigger>
                  <AccordionContent>
                    <MintToken mintAddress={mintAddress} decimal={decimal} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="transferToken">
                  <AccordionTrigger>Transfer Token</AccordionTrigger>
                  <AccordionContent>
                    <TransferToken
                      mintAddress={mintAddress}
                      decimal={decimal}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="burnToken">
                  <AccordionTrigger>Burn Token</AccordionTrigger>
                  <AccordionContent>
                    <BurningToken mintAddress={mintAddress} decimal={decimal} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="deledationToken">
                  <AccordionTrigger>Delegation Token</AccordionTrigger>
                  <AccordionContent>
                    <DelegationToken
                      mintAddress={mintAddress}
                      decimal={decimal}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
