import { useState, useEffect } from "react";

// wallet actions
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

//spl token
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

//ui components
import { Popup, Button } from "pixel-retroui";

interface TokenBalanceProps {
  mintAddress: string;
  decimal: number;
}

function TokenBalance({ mintAddress, decimal }: TokenBalanceProps) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<number>(10);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;

      try {
        const mintPublicKey = new PublicKey(mintAddress);
        const tokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          publicKey,
        );
        const account = await getAccount(connection, tokenAccount);
        const accountBalance = Number(account.amount) / Math.pow(10, decimal);
        setBalance(Number(accountBalance));
        setLastRefreshed(new Date());
        setNextRefresh(10);
      } catch (error: any) {
        console.error("Error fetching token balance:", error);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000); // Refresh every 10 seconds

    const countdownId = setInterval(() => {
      setNextRefresh((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [connection, publicKey, mintAddress]);

  return (
    <div>
      <Button
        onClick={openPopup}
        bg="#FF00FF"
        textColor="#FFD700"
        borderColor="#32CD32"
      >
        View Token Balance
      </Button>
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        bg="#FF00FF"
        baseBg="#00FFFF"
        textColor="#FFD700"
        borderColor="#32CD32"
      >
        <div className="flex flex-col items-start justify-evenly">
          <h2 className="text-2xl font-bold">Token Balance</h2>
          {balance !== null ? (
            <>
              <p className="text-lg font-semibold">
                Your token balance: {balance}
              </p>
            </>
          ) : (
            <p>No Balance</p>
          )}
          <p className="text-sm ">Next refresh in: {nextRefresh} seconds</p>
        </div>
      </Popup>
    </div>
  );
}

export default TokenBalance;
