"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CreateToken from "./components/CreateToken";
import MintToken from "./components/MintToken";
import TransferToken from "./components/TransferToken";
import BurningToken from "./components/BurningToken";
import DelegationToken from "./components/DelegationToken";

export default function Home() {
  return (
    <main className="">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
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
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Token Forge
            </span>
          </a>

          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <div className="border hover:border-slate-900 rounded">
              <WalletMultiButton style={{}} />
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col justify-evenly items-center h-screen">
        <CreateToken />
        <MintToken />
        <TransferToken />
        <BurningToken />
        <DelegationToken />
      </div>
    </main>
  );
}
