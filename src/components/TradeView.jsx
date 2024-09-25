import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export function TradeView({ market }) {
    const chartRef = useRef(null);
    const chartManagerRef = useRef(null);

    const init = async () => {
        try {
            const klineData = await getKlines(
                market, 
                "1h", 
                Math.floor((new Date().getTime() - 1000 * 60 * 60 * 36 * 7) / 1000), 
                Math.floor(new Date().getTime() / 1000)
            );

            if (chartRef.current) {
                if (chartManagerRef.current) {
                    chartManagerRef.current.destroy();
                }
                
                const chartManager = new ChartManager(
                    chartRef.current,
                    klineData.map((x) => ({
                        close: parseFloat(x.close),
                        high: parseFloat(x.high),
                        low: parseFloat(x.low),
                        open: parseFloat(x.open),
                        timestamp: new Date(x.end),
                    })).sort((x, y) => (x.timestamp - y.timestamp)) || [],
                    {
                        background: "#0e0f14",
                        color: "white",
                    }
                );

                chartManagerRef.current = chartManager; // Set the current chart manager
            }
        } catch (error) {
            console.error("Error fetching Kline data:", error);
        }
    };

    useEffect(() => {
        const handleKlineUpdate = (data) => {
            console.log(data);
            chartManagerRef.current?.update(data);
        };

        SignalingManager.getInstance().registerCallback("kline", handleKlineUpdate, `KLINE-${market}`);
        init();

        // Cleanup function
        return () => {
            SignalingManager.getInstance().deRegisterCallback("kline", `KLINE-${market}`);
            chartManagerRef.current?.destroy(); // Optional: destroy the chart manager on unmount
        };
    }, [market]);

    return (
        <div ref={chartRef} style={{ height: "100%", width: "100%", marginTop: 4 }}></div>
    );
}
