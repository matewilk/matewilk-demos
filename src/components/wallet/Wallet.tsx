import { ethers } from "ethers";
import { useState, useEffect } from "react";
import WalletBalance from "./WalletBalance";
import WalletActions from "./WalletActions";

const noExtensionText =
  "It does appear you don't have a crypto wallet extension installed in your browser";

const Wallet = () => {
  const [wallet, setWallet] = useState({
    connected: false,
    balance: "",
    address: "",
    error: "",
  });

  // args is chain hex number
  const chainChange = async (args: any) => {
    // switch chain
    const ethscanProvider = new ethers.providers.EtherscanProvider(
      parseInt(args, 16) // hex to decimal
    );

    // reconnect wallet (with new chain)
    await connectWallet();

    // fetch wallet history (move logic somewhere else)
    const history = await ethscanProvider.getHistory(wallet.address);
    history.map((tr) => {
      console.log(ethers.utils.formatEther(tr.value /* wei */)); // transaction value in eth
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;
      ethereum.on("chainChanged", chainChange);
      // ethereum.on("accountsChanged", () => {});

      return () => {
        ethereum.removeListener("chainChanged", chainChange);
        // ethereum.removeListener("accountsChanged", () => {}));
      };
    }
  });

  const sendTransaction = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        const tx: ethers.providers.TransactionRequest = {
          from: address,
          to: "0xd0C8837f161F0f6546D29FeBeB1F530bA66b5010",
          value: ethers.utils.parseEther("0.0001"),
          nonce: await provider.getTransactionCount(address),
          gasLimit: ethers.utils.hexlify(10000),
          gasPrice: ethers.utils.hexlify(await provider.getGasPrice()),
        };

        const transaction = await signer.sendTransaction(tx);
        console.log(transaction);
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const ethBalance = ethers.utils.formatEther(balance);

        setWallet({ ...wallet, connected: true, balance: ethBalance, address });
      } catch (error: any) {
        setWallet({ ...wallet, connected: false, error: error.message! });
      }
    } else {
      setWallet({
        ...wallet,
        connected: false,
        error: noExtensionText,
      });
    }
  };

  return (
    <section id="balance" aria-label="balance">
      <div className="mx-auto flex h-min max-w-7xl flex-col items-center justify-between gap-10 bg-blue-100 py-10">
        <WalletBalance {...wallet} />
        <WalletActions
          connectWallet={connectWallet}
          sendTransaction={sendTransaction}
          connected={wallet.connected}
        />
      </div>
    </section>
  );
};

export default Wallet;
