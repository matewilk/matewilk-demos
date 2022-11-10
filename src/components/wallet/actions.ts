import { type Dispatch, type ReducerAction } from "react";
import { ethers } from "ethers";
import {
  connect,
  send,
  chainChange as chainChangeAction,
} from "./walletReducer";

const noExtensionText =
  "It does appear you don't have a crypto wallet extension installed in your browser";

export const connectWallet = async (dispatch: Dispatch<ReducerAction<any>>) => {
  if (window.ethereum) {
    try {
      dispatch(connect({ isLoading: true, error: "" }));

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await provider.getBalance(address);
      const balance = ethers.utils.formatEther(bigBalance);

      dispatch(
        connect({
          data: {
            connected: true,
            balance,
            address,
          },
          isLoading: false,
        })
      );
    } catch (error: any) {
      dispatch(connect({ error: error.message, isLoading: false }));
    }
  } else {
    dispatch(connect({ error: noExtensionText, isLoading: false }));
  }
};

export const chainChange =
  (dispatch: Dispatch<ReducerAction<any>>) =>
  // args is chain hex number
  async (chainHex: string) => {
    if (window.ethereum) {
      try {
        dispatch(chainChangeAction({ isLoading: true, error: "" }));

        const chainDecimal = parseInt(chainHex, 16); // hex to decimal
        // switch chain
        new ethers.providers.EtherscanProvider(chainDecimal);
        // update chain in state
        dispatch(chainChangeAction({ data: { chain: chainDecimal } }));
        // reconnect wallet (with new chain)
        await connectWallet(dispatch);
        // fetch wallet history (move logic somewhere else)
        // const history = await ethscanProvider.getHistory(wallet.address);
        // history.map((tr) => {
        //   console.log(ethers.utils.formatEther(tr.value /* wei */)); // transaction value in eth
        // });
      } catch (e: any) {
        dispatch(chainChangeAction({ error: e.message, isLoading: false }));
      }
    }
  };

export const sendTransaction = async (
  dispatch: Dispatch<ReducerAction<any>>
) => {
  if (window.ethereum) {
    try {
      dispatch(send({ isLoading: true, error: "" }));

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
      dispatch(send({ data: { transaction }, isLoading: false }));
    } catch (e: any) {
      dispatch(send({ error: e.message, isLoading: false }));
    }
  }
};
