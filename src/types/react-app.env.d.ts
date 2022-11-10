import { Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Privider;
  }
}
