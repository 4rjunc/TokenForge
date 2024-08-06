import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
} from "@solana/spl-token";
import * as bs58 from "bs58";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const CreateToken = () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const { publicKey } = useWallet();
  console.log("Connection", connection, "Public", publicKey?.toString());
  return <div>CreateToken</div>;
};

export default CreateToken;
