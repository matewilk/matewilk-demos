import { useState, useEffect } from "react";

import CoinGecko from "coingecko-api";

type CGFiatType = {
  gbp: number;
  usd: number;
  eur: number;
};

type CGSimplePriceResponseType = {
  ethereum: CGFiatType;
};

const coinGeckoClient = new CoinGecko();

export const useCoinGecko = (trigger: any) => {
  // state to keep CoinGecko response in
  const [fiatPrice, setFiatPrice]: [
    eth: CGSimplePriceResponseType | undefined,
    setEthPrice: Function
  ] = useState();

  useEffect(() => {
    const getEthPrice = async () => {
      const { data, success } = await coinGeckoClient.simple.price({
        ids: ["ethereum"],
        vs_currencies: ["eur", "usd", "gbp"],
      });
      if (success) {
        setFiatPrice(data);
      }
    };
    getEthPrice();
  }, [trigger]);

  return fiatPrice;
};
