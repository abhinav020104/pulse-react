"use client";
import { useEffect, useState } from "react";
import { Ticker as TickerType } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ( market ) => {
  const [ticker, setTicker] = useState<TickerType | null>(null);
  const [curr24hdata, set24hData] = useState({
    currentPrice: "0",
    change24h: "0",
    change24hPercentage: "0",
    high24h: "0",
    low24h: "0",
    volume24h: "0",
  });

  const fetchTicker = async () => {
    try {
      const response = await getTicker(market);
      console.log(response);
      setTicker(response);
    } catch (error) {
      console.log(error);
      console.log("Error while getting ticker data");
    }
  };

  useEffect(() => {
    fetchTicker();
    const signalingManager = SignalingManager.getInstance();
    
    signalingManager.registerCallback(
      "ticker",
      (data) =>
        setTicker((prevTicker) => ({
          firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
          high: data?.high ?? prevTicker?.high ?? "",
          currentPrice: data?.currentPrice ?? prevTicker?.currentPrice ?? "",
          low: data?.low ?? prevTicker?.low ?? "",
          priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
          quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: data?.symbol ?? prevTicker?.symbol ?? "",
          trades: data?.trades ?? prevTicker?.trades ?? "",
          volume: data?.volume ?? prevTicker?.volume ?? "",
        })),
      `TICKER-${market}`
    );

    signalingManager.registerCallback(
      "24hstats",
      (data) =>
        set24hData((prev) => ({
          currentPrice: data?.currentPrice ?? prev?.currentPrice ?? "",
          change24h: data?.change24h ?? prev?.change24h ?? "",
          change24hPercentage: data?.change24hPercentage ?? prev?.change24hPercentage ?? "",
          high24h: data?.high24h ?? prev?.high24h ?? "",
          low24h: data?.low24h ?? prev?.low24h ?? "",
          volume24h: data?.volume24h ?? prev?.volume24h ?? "",
        })),
      `24DATA-${market}`
    );

    signalingManager.sendMessage({ method: "SUBSCRIBE", params: [`ticker@${market}`] });
    signalingManager.sendMessage({ method: "SUBSCRIBE", params: [`kline@${market}`] });
    signalingManager.sendMessage({ method: "SUBSCRIBE", params: [`24hdata@${market}`] });

    return () => {
      // Optionally unsubscribe and deregister callbacks if needed
      // signalingManager.deRegisterCallback("ticker", `TICKER-${market}`);
      // signalingManager.sendMessage({ method: "UNSUBSCRIBE", params: [`ticker@${market}`] });
    };
  }, [market]);

  return (
    <div>
      <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <Ticker market={market} />
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums text-md ${
                  (ticker?.currentPrice ?? 0) > (ticker?.firstPrice ?? 0) ? "text-blue-500" : "text-red-500"
                }`}
              >
                ${ticker?.currentPrice}
              </p>
              <p className="font-medium text-sm tabular-nums">${ticker?.currentPrice}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400">24H Change</p>
              <p
                className={`text-sm font-medium tabular-nums leading-5 ${
                  Number(curr24hdata?.change24h) > 0 ? "text-blue-500" : "text-red-500"
                }`}
              >
                {Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(curr24hdata?.change24hPercentage)?.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400">24H High</p>
              <p className="text-sm font-medium tabular-nums leading-5">{curr24hdata?.high24h}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400">24H Low</p>
              <p className="text-sm font-medium tabular-nums leading-5">{curr24hdata?.low24h}</p>
            </div>
            <button type="button" className="font-medium transition-opacity hover:opacity-80 cursor-pointer text-base text-left">
              <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400">24H Volume</p>
                <p className="mt-1 text-sm font-medium tabular-nums leading-5">{curr24hdata?.volume24h}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Ticker( market ) {
  return (
    <div className="flex h-[60px] shrink-0 space-x-4">
      <div className="flex flex-row relative ml-2 -mr-4">
        <img
          alt="SOL Logo"
          loading="lazy"
          decoding="async"
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
          src="/sol.webp"
        />
        <img
          alt="USDC Logo"
          loading="lazy"
          decoding="async"
          className="h-6 w-6 -ml-2 mt-4 rounded-full"
          src="/usdc.webp"
        />
      </div>
      <button type="button" className="react-aria-Button">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2">
            <div className="flex flex-row relative">
              <p className="font-medium text-sm">{market.replace("_", " / ")}</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
