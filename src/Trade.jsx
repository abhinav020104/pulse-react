"use client"; // Keep if you're using Next.js; otherwise, remove it
import { useEffect, useState } from "react";
import { MarketBar } from "./components/MarketBar";
import { SwapUI } from "./components/SwapUI";
import { TradeView } from "./components/TradeView";
import { Depth } from "./components/depth/Depth";
import { getTickers } from "./utils/httpClient";
import { SignalingManager } from "./utils/SignalingManager";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom"; // Import from react-router-dom

export default function Trade() {
    const { market } = useParams(); 
    const [tickers, setTickers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickers = async () => {
            try {
                const data = await getTickers();
                toast.loading("Subscribing to ticker data !");
                const initialTickers = {};
                data.forEach((ticker) => {
                    console.log(ticker);
                    initialTickers[ticker.symbol] = {
                        currentPrice: ticker.currentPrice
                    };
                    console.log("Initial Tickers Are -> ");
                    console.log(initialTickers);
                    if (ticker.symbol !== market) {
                        subscribeToTicker(ticker.symbol);
                    }
                });

                setTickers(initialTickers);

                toast.dismiss();
                toast.success("Subscribed to ticker data !");
            } catch (error) {
                toast.dismiss();
                toast.error("Failed to fetch tickers !");
                console.error("Error fetching tickers:", error);
            }
        };

        fetchTickers();
    }, [market]);

    const handleTickerClick = (symbol) => {
        navigate(`/trade/${symbol}`); // Use navigate for routing
    };

    const subscribeToTicker = (symbol) => {
        SignalingManager.getInstance().sendMessage({
            method: "SUBSCRIBE",
            params: [`ticker@${symbol}`],
        });

        SignalingManager.getInstance().registerCallback(
            "allTickers",
            (data) => {
                setTickers((prevTickers) => ({
                    ...prevTickers,
                    [data.symbol]: {
                        currentPrice: data?.currentPrice
                    }
                }));
            },
            `TICKER-${symbol}`
        );
    };

    console.log("Printing tickers");
    console.log(tickers);

    return (
        <div className="flex flex-row flex-1 overflow-y-hidden overflow-x-hidden">
            {/* Ticker List */}
            <div className="flex flex-col w-[250px] bg-gray-800 border-r border-gray-700 p-4 shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-200 border-b border-gray-600 pb-2 tracking-wider">
                    Market Overview
                </h2>
                <ul className="space-y-4">
                    {Object.keys(tickers).map((symbol) => (
                        symbol !== market && (
                            <li
                                key={symbol}
                                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-transform duration-300 cursor-pointer transform hover:scale-105 shadow-md"
                                onClick={() => handleTickerClick(symbol)}
                            >
                                <span className="text-gray-300 font-medium text-sm tracking-wide">{symbol}</span>
                                <span className={`text-lg ${tickers[symbol]?.priceChange !== "0" ? 'text-green-400' : 'text-red-400'} font-bold`}>
                                    ${tickers[symbol]?.currentPrice}
                                </span>
                            </li>
                        )
                    ))}
                </ul>
            </div>

            <div className="flex flex-col flex-1 overflow-y-hidden">
                <MarketBar market={market} />
                <div className="flex flex-row border-y h-[80vh] border-slate-800">
                    <div className="flex flex-col flex-1">
                        <TradeView market={market} />
                    </div>
                    <div className="flex flex-col w-[250px] h-[100%]">
                        <Depth market={market} />
                    </div>
                </div>
            </div>

            <div className="w-[10px] flex-col border-slate-800 border-l"></div>

            <div className="flex flex-col w-[250px]">
                <SwapUI market={market} />
            </div>
        </div>
    );
}
