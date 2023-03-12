import { useState } from "react";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";

const Wallet = () => {
  const [showSendForm, setShowSendForm] = useState(false);

  return (
    <section id="wallet" aria-label="wallet">
      <div className="mx-auto flex h-min w-full flex-col items-center justify-between gap-10 py-10 text-white">
        <WalletBalance
          showSendForm={showSendForm}
          setShowSendForm={setShowSendForm}
        />

        <WalletActions
          setShowSendForm={setShowSendForm}
          showSendForm={showSendForm}
        />
      </div>
    </section>
  );
};

export default Wallet;
