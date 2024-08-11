import { useState } from "react";

//wallet actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

//solana spl token
import {
  getAssociatedTokenAddress,
  createBurnInstruction,
} from "@solana/spl-token";

//ui components
import { Button } from "pixel-retroui";
import Image from "next/image";
import { Input } from "pixel-retroui";

interface BurningTokenProps {
  mintAddress: string;
  decimal: number;
}

const BurningToken = ({ mintAddress, decimal }: BurningTokenProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // burn them !
  const handleBurnToken = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      const amountToBurn: number = Number(amount) * Math.pow(10, decimal);
      const transaction = new Transaction().add(
        createBurnInstruction(ata, mintPublicKey, publicKey, amountToBurn),
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Tokens Burned: ${amount}`);
    } catch (error: any) {
      console.error(`Error buring tokens: ${error} `);
      setMessage(`Erro buring tokens : ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2 justify-evenly">
      <Image
        alt="fire-girl"
        src="/fire-girl.gif"
        width="250"
        height="220"
        className="rounded-lg"
      />

      <div className="flex flex-col gap-3">
        <h2>Burn Tokens</h2>
        <p>Buring tokens permanently from the circulation.</p>

        <Input
          type="number"
          min="0"
          step="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount of tokens to burn"
        />

        <Button className="mt-4" onClick={handleBurnToken}>
          {isProcessing ? "Processing..." : "Click Me!"}
        </Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default BurningToken;
