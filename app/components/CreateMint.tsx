import { useState } from "react";

// for waller actions
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

//spl-token actions
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";

//ui components
import Image from "next/image";
import { Button } from "pixel-retroui";
import { Card } from "pixel-retroui";
import { Input } from "pixel-retroui";

interface CreateMintProps {
  onMintCreated: (mintAddress: string, decimal: number) => void;
}

const CreateMint = ({ onMintCreated }: CreateMintProps) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [decimals, setDecimals] = useState<number>(9);
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateMint = async () => {
    if (!publicKey) {
      setMessage("Wallet not connected");
      return;
    }

    setIsProcessing(true);
    try {
      const mint = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mint.publicKey,
          decimals,
          publicKey,
          publicKey,
        ),
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [mint],
      });
      await connection.confirmTransaction(signature, "confirmed");

      const mintAddress = mint.publicKey.toBase58();
      setMessage(`Mint created successfully: ${mintAddress}`);
      onMintCreated(mintAddress, decimals);
    } catch (error: any) {
      setMessage(`Error creating mint: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        shadowColor="#c381b5"
        className="p-4 text-center flex flex-col gap-1"
      >
        <h2>Create Token Mint</h2>
        <p>Create a new token mint to issue your own tokens</p>
        <Input
          type="number"
          min="0"
          max="9"
          step="1"
          value={decimals}
          onChange={(e) => setDecimals(e.target.value)}
          placeholder="Decimals"
          className="mb-4"
        />
        <Button
          onClick={handleCreateMint}
          bg="#fefcd0"
          textColor="black"
          borderColor="black"
        >
          {isProcessing ? "Processing..." : "Click Me!"}
        </Button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </Card>{" "}
      <Image
        src="/sonic-sonic-waiting.gif"
        alt="sonic-sonic-waiting"
        width="231"
        height="271"
      />
    </div>
  );
};

export default CreateMint;
