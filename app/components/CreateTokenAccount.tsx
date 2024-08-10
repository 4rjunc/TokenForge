import { useState } from "react";

//wallet actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

//solana spl token
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

//ui components
import { Button } from "pixel-retroui";
import Image from "next/image";

interface CreateTokenAccountProps {
  mintAddress: string;
}

const CreateTokenAccount = ({ mintAddress }: CreateTokenAccountProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateTokenAccount = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      //create a transaction object to be send to solana chain
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          ata,
          publicKey,
          mintPublicKey,
        ),
      );

      //getting signature from the users wallet to verify the transaction
      const signature = await sendTransaction(transaction, connection);

      //checks the transaction is successfull or not
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Associated Token Account created: ${ata.toBase58()}`);
    } catch (error: any) {
      console.error(`Error Creating Associated Token Account: ${error} `);
      setMessage(`Error Creating Associated Token Account: ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-evenly">
      <div>
        <Image
          alt="monkey-calulate"
          src="/monkey-calculate.gif"
          width="250"
          height="220"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2>Create Associated Token Account</h2>
        <p>Create an token account to hold your tokens</p>
        <Button className="mt-4" onClick={handleCreateTokenAccount}>
          {isProcessing ? "Processing..." : "Click Me!"}
        </Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default CreateTokenAccount;
