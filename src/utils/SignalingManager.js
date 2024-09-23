import { UTCTimestamp } from "lightweight-charts"; // You can remove this if not needed in the JS version
import { Ticker } from "./types"; // You can remove this if not needed in the JS version

export const BASE_URL = "wss://pulse-ws-server.codewithabhinav.online";

export class SignalingManager {
    constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.callbacks = {};
        this.id = 1;
        this.initialized = false;
        this.init();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            console.log(message.data.s);
            if (this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker = {
                            currentPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        };
                        callback(newTicker);
                    }
                    if (type === "depth") {
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                    if (type === "kline") {
                        console.log("inside kline register", message.data);
                        const newKlineData = [];
                        const klineData = {
                            time: new Date(message.data.time),
                            close: parseFloat(message.data.close),
                            high: parseFloat(message.data.high),
                            low: parseFloat(message.data.low),
                            open: parseFloat(message.data.open),
                        };
                        console.log(new Date(message.data.T));
                        newKlineData.push(klineData);
                        callback(newKlineData[0]);
                    }
                    if (type === "24hstats") {
                        const response = {
                            currentPrice: message.data.currentPrice,
                            change24h: message.data.change24h,
                            change24hPercentage: message.data.change24hPercentage,
                            high24h: message.data.high24h,
                            low24h: message.data.low24h,
                            volume24h: message.data.volume24h,
                        };
                        callback(response);
                    }
                    if (type === "allTickers") {
                        console.log(message.data.c);
                        const response = {
                            symbol: message.data.s,
                            currentPrice: message.data.c,
                        };
                        callback(response);
                    }
                });
            }
        };
    }

    sendMessage(message) {
        const messageToSend = {
            ...message,
            id: this.id++,
        };
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type, callback, id) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
    }

    async deRegisterCallback(type, id) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}
