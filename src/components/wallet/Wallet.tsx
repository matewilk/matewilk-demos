import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";
import { WalletProvider } from "@/providers/WalletContextProvider";
import { useIsMounted } from "@/hooks/useIsMounted";

const Wallet = () => {
  const isMounted = useIsMounted();

  return (
    <WalletProvider>
      <section id="balance" aria-label="balance">
        <div className="mx-auto flex h-min max-w-7xl flex-col items-center justify-between gap-10 bg-blue-100 py-10">
          {isMounted ? <WalletBalance /> : null}
          {isMounted ? <WalletActions /> : null}
        </div>
      </section>
    </WalletProvider>
  );
};

export default Wallet;
