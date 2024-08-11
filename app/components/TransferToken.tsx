import { useState } from "react";

//wallet actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

//solana spl token
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

//ui components
import { Button } from "pixel-retroui";
import Image from "next/image";
import { Input } from "pixel-retroui";

interface TransferTokenProps {
  mintAddress: string;
  decimal: number;
}

const TransferToken = ({ mintAddress, decimal }: TransferTokenProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [transferAddress, setTransferAddress] = useState<string>("");
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // transfer some token dude!
  const handleTokenTranfer = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const recipientPublicKey = new PublicKey(transferAddress);

      const sourceAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey,
      );
      const destinationAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey,
      );
      const transaction = new Transaction();

      const recipientTokenAccountInfo =
        await connection.getAccountInfo(destinationAccount);

      if (!recipientTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            destinationAccount,
            recipientPublicKey,
            mintPublicKey,
          ),
        );
      }

      const amountToTransfer: number = Number(amount) * Math.pow(10, decimal);
      transaction.add(
        createTransferInstruction(
          sourceAccount,
          destinationAccount,
          publicKey,
          amountToTransfer,
        ),
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Transferred ${amount} tokens to ${transferAddress}`);
    } catch (error: any) {
      console.error(`Error minting tokens: ${error} `);
      setMessage(`Make sure you created ata, Error : ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2 justify-evenly">
      <div className="flex flex-col gap-3">
        <h2>Transfer Tokens</h2>
        <p>Send some tokens to your friend.</p>
        <Input
          type="text"
          onChange={(e) => setTransferAddress(e.target.value)}
          placeholder="Recipient address"
        />

        <Input
          type="number"
          min="0"
          step="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount of token to send"
        />

        <Button className="mt-4" onClick={handleTokenTranfer}>
          {isProcessing ? "Processing..." : "Click Me!"}
        </Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
      <div>
        <Image
          alt="monkey-calulate"
          src="/excited-money.gif"
          width="250"
          height="220"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default TransferToken;
