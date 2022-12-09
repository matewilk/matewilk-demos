import { useState } from "react";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";

const Wallet = () => {
  const [showSendForm, setShowSendForm] = useState(false);

  return (
    <section id="wallet" aria-label="wallet">
      <div className="mx-auto flex h-min w-full flex-col items-center justify-between gap-10 bg-blue-100 py-10">
        <WalletBalance
          showSendForm={showSendForm}
          setShowSendForm={setShowSendForm}
        />

        <WalletActions setShowSendForm={setShowSendForm} />
      </div>
    </section>
  );
};

export default Wallet;
