import { useState, useEffect } from "react";

// waller actions
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const BalanceDisplay = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(publicKey, (updatedAccountInfo) => {
      setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    });

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info!.lamports);
    });
  }, [publicKey, connection]);

  return <div className="">Balance:{balance / LAMPORTS_PER_SOL} SOL</div>;
};

export default BalanceDisplay;
