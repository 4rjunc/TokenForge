import { useState } from "react";

//wallet actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";

//solana spl token
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  createApproveInstruction,
  createRevokeInstruction,
} from "@solana/spl-token";

//ui components
import { Button } from "pixel-retroui";
import Image from "next/image";
import { Input } from "pixel-retroui";

interface DelegationTokenProps {
  mintAddress: string;
  decimal: number;
}

const DelegationToken = ({ mintAddress, decimal }: DelegationTokenProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [transferAddress, setTransferAddress] = useState<string>("");
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // delegate the tokenzz !
  const handleDelegation = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const delegatePublicKey = new PublicKey(transferAddress);
      const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      const amountToTransfer: number = Number(amount) * Math.pow(10, decimal);
      const transaction = new Transaction().add(
        createApproveInstruction(
          ata,
          delegatePublicKey,
          publicKey,
          amountToTransfer,
        ),
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Delegated ${amount} tokens to ${transferAddress}`);
    } catch (error: any) {
      console.error(`Error delegating tokens: ${error} `);
      setMessage(`Error while delegating token: ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // revoke the tokenzz !
  const handleRevoke = async () => {
    if (!publicKey) {
      return;
    }

    setIsProcessing(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      const transaction = new Transaction().add(
        createRevokeInstruction(ata, publicKey),
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setMessage(`Revoked Successfully`);
    } catch (error: any) {
      console.error(`Error revoking tokens: ${error} `);
      setMessage(`Error while revoking token: ${error.meesage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-1 justify-evenly">
      <div>
        <Image
          alt="kratos"
          src="/kratos.gif"
          width="250"
          height="220"
          className="rounded-lg"
        />
      </div>{" "}
      <div className="flex flex-col gap-3">
        <h2>Delegate Tokens</h2>
        <p>Delegate the authority of token.</p>
        <Input
          type="text"
          onChange={(e) => setTransferAddress(e.target.value)}
          placeholder="Deletgate address"
        />

        <Input
          type="number"
          min="0"
          step="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount of token to delegate"
        />

        <Button className="mt-4" onClick={handleDelegation}>
          {isProcessing ? "Processing..." : "Delegate"}
        </Button>
        <Button className="mt-4" onClick={handleRevoke}>
          {isProcessing ? "Processing..." : "Revoke"}
        </Button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default DelegationToken;
