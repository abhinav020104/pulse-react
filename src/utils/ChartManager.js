import {
  createChart as createLightWeightChart,
  CrosshairMode,
  ColorType,
} from "lightweight-charts";

export class ChartManager {
  constructor(ref, initialData, layout) {
    const chart = createLightWeightChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: layout.background,
        },
        textColor: "white",
      },
    });
    this.chart = chart;
    this.candleSeries = chart.addCandlestickSeries();
    this.candleSeries.applyOptions({
      wickUpColor: 'rgb(54, 116, 217)',
      upColor: 'rgb(54, 116, 217)',
      wickDownColor: 'rgb(225, 50, 85)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,
    });
    console.log(typeof initialData[0].timestamp);
    console.log(initialData[0].timestamp / 1000);

    this.candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: data.timestamp / 1000,
      }))
    );
  }

  update(updatedPrice) {
    console.log(updatedPrice.time / 1000);
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date().getTime();
    }

    this.candleSeries.update({
      time: updatedPrice.time / 1000,
      close: updatedPrice.close,
      low: updatedPrice.low,
      high: updatedPrice.high,
      open: updatedPrice.open,
    });

    if (updatedPrice.newCandleInitiated) {
      this.lastUpdateTime = updatedPrice.time;
    }
  }

  destroy() {
    this.chart.remove();
  }
}
