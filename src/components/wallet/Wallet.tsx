import { useEffect } from "react";

import { useWallet } from "./WalletContext";
import { chainChange } from "./actions";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";

const Wallet = () => {
  const { dispatch } = useWallet();

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;
      ethereum.on("chainChanged", chainChange(dispatch));
      // ethereum.on("accountsChanged", () => {});

      return () => {
        ethereum.removeListener("chainChanged", chainChange(dispatch));
        // ethereum.removeListener("accountsChanged", () => {}));
      };
    }
  }, []);

  return (
    <section id="balance" aria-label="balance">
      <div className="mx-auto flex h-min max-w-7xl flex-col items-center justify-between gap-10 bg-blue-100 py-10">
        <WalletBalance />
        <WalletActions />
      </div>
    </section>
  );
};

export default Wallet;
