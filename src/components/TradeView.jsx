import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";
import { SignalingManager } from "../utils/SignalingManager";

export function TradeView(
  market) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  let klineData = [];
  const init = async () => {
    try {
      klineData = await getKlines(market, "1h", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 36 * 7) / 1000), Math.floor(new Date().getTime() / 1000));
      console.log(klineData);
      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end), 
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      } 
    } catch (e) { }
  };
  
  useEffect(() => {
    SignalingManager.getInstance().registerCallback("kline" , (data) =>{
      console.log(data);
      chartManagerRef.current?.update(data);
    } , `KLINE-${market}`)
    init();
  }, [market, chartRef]);

  return (
    <>
      <div ref={chartRef} style={{ height: "100%", width: "100%", marginTop: 4 }}></div>
    </>
  );
}
