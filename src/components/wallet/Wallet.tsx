import { useState } from "react";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";
import { useIsMounted } from "@/hooks/useIsMounted";

const Wallet = () => {
  const isMounted = useIsMounted();
  const [showSendForm, setShowSendForm] = useState(false);

  return (
    <section id="wallet" aria-label="wallet">
      <div className="mx-auto flex h-min w-full flex-col items-center justify-between gap-10 bg-blue-100 py-10">
        {isMounted ? (
          <WalletBalance
            showSendForm={showSendForm}
            setShowSendForm={setShowSendForm}
          />
        ) : null}
        {isMounted ? <WalletActions setShowSendForm={setShowSendForm} /> : null}
      </div>
    </section>
  );
};

export default Wallet;
