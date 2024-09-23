import axios from "axios";

// const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";
const BASE_URL = "https://pulse-api-server.codewithabhinav.online/api/v1";

export async function getTicker(market) {
    console.log(market);
    const tickers = await getTickers();
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers() {
    const response = await axios.get(`${BASE_URL}/tickers`);
    console.log(response.data.data.payload.tickers);
    return response.data.data.payload.tickers;
}

export async function getDepth(market) {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    const data = response.data;

    // Filter out bids and asks with 0 quantity
    const filteredBids = data.bids.filter(bid => Number(bid[1]) > 0);
    const filteredAsks = data.asks.filter(ask => Number(ask[1]) > 0);

    // Return the modified data
    return {
        ...data,
        bids: filteredBids,
        asks: filteredAsks,
    };
}

export async function getTrades(market) {
    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getKlines(market, interval, startTime, endTime) {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data = response.data;
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
