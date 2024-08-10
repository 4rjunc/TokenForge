import { useState } from "react";

//wallet actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

//solana spl token
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

//ui components
import { Button } from "pixel-retroui";
import Image from "next/image";
import { Input } from "pixel-retroui";

interface MintTokenProps {
  mintAddress: string;
}

const MintToken = ({ mintAddress }: MintTokenProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // mint some token dude!
  const handleMintToken = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      //create a transaction object to be send to solana chain
      const transaction = new Transaction().add(
        createMintToInstruction(mintPublicKey, ata, publicKey, BigInt(amount)),
      );

      //getting signature from the users wallet to verify the transaction
      const signature = await sendTransaction(transaction, connection);

      //checks the transaction is successfull or not
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Minted ${amount} to account ${publicKey.toBase58()}`);
    } catch (error: any) {
      console.error(`Error minting tokens: ${error} `);
      setMessage(`Make sure you created ata, Error : ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2 justify-evenly">
      <div>
        <Image
          alt="monkey-calulate"
          src="/cat-printer.gif"
          width="250"
          height="220"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2>Mint Some Tokens</h2>
        <p>Create token and add it to your acc. </p>
        <Input
          type="number"
          min="0"
          step="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount token to Mint"
        />

        <Button className="mt-4" onClick={handleMintToken}>
          {isProcessing ? "Processing..." : "Click Me!"}
        </Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default MintToken;
