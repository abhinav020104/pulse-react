import { useEffect, useState } from "react";
import { getDepth, getTicker } from "../../utils/httpClient";
import  BidTable  from "./BidTable";
import  AskTable  from "./AskTable";
import { SignalingManager } from "../../utils/SignalingManager"; // Adjust the path if necessary

export function Depth({ market }) {
    const [bids, setBids] = useState([]);
    const [asks, setAsks] = useState([]);
    const [ticker, setTicker] = useState(null);

    useEffect(() => {
        const fetchTicker = async () => {
            const fetchedTicker = await getTicker(market);
            console.log(fetchedTicker)
            setTicker(fetchedTicker);
        };

        fetchTicker();

        const updateTicker = (data) => {
            setTicker((prevTicker) => ({
                firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
                high: data?.high ?? prevTicker?.high ?? '',
                currentPrice: data?.currentPrice ?? prevTicker?.currentPrice ?? '',
                low: data?.low ?? prevTicker?.low ?? '',
                priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
                priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
                quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
                symbol: data?.symbol ?? prevTicker?.symbol ?? '',
                trades: data?.trades ?? prevTicker?.trades ?? '',
                volume: data?.volume ?? prevTicker?.volume ?? '',
            }));
        };

        const updateDepth = (data) => {
            setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++) {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            break;
                        }
                    }
                }

                let filteredBids = bidsAfterUpdate.filter(bid => Number(bid[1]) > 0);

                data.bids.forEach((newBid) => {
                    if (!filteredBids.some(bid => bid[0] === newBid[0])) {
                        filteredBids.push(newBid);
                    }
                });

                filteredBids = filteredBids.filter(bid => Number(bid[1]) > 0);
                filteredBids.sort((a, b) => Number(b[0]) - Number(a[0]));

                return filteredBids;
            });

            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];

                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++) {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            break;
                        }
                    }
                }

                let filteredAsks = asksAfterUpdate.filter(ask => Number(ask[1]) > 0);

                data.asks.forEach((newAsk) => {
                    if (!filteredAsks.some(ask => ask[0] === newAsk[0])) {
                        filteredAsks.push(newAsk);
                    }
                });

                filteredAsks = filteredAsks.filter(ask => Number(ask[1]) > 0);
                filteredAsks.sort((a, b) => Number(a[0]) - Number(b[0]));

                return filteredAsks;
            });
        };

        SignalingManager.getInstance().registerCallback("ticker", updateTicker, `TICKER-${market}`);
        SignalingManager.getInstance().registerCallback("depth", updateDepth, `DEPTH-${market}`);
        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`depth@${market}`] });
        console.log(market);
        getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`depth@${market}`] });
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker", `DEPTH-${market}`);
        };
    }, [market]); // Added market as a dependency

    console.log("Ticker:", ticker);
    console.log("Bids:", bids);
    console.log("Asks:", asks);

    return (
        <div className="h-[100%]">
            <TableHeader />
            {asks.length > 0 && <AskTable asks={asks} />}
            {ticker && (
                <div className={`text-[1.2rem] ${(ticker.currentPrice ?? 0) > (ticker.firstPrice ?? 0) ? 'text-blue-500' : 'text-red-500'}`}>
                    {ticker.currentPrice ?? 0}
                </div>
            )}
            {bids.length > 0 && <BidTable bids={bids} />}
        </div>
    );
}

function TableHeader() {
    return (
        <div className="flex justify-between text-xs">
            <div className="text-white pl-1 pr-1">Price</div>
            <div className="text-slate-500 pl-1 pr-1">Size</div>
            <div className="text-slate-500 pl-1 pr-1">Total</div>
        </div>
    );
}
