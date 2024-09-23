"use client";
import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { userAtom, tokenAtom } from "../store/User";
import toast from "react-hot-toast";
import axios from "axios";

export function SwapUI(market) {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const [type, setType] = useState("limit");
  const token = useRecoilValue(tokenAtom);
  const [user, setUser] = useRecoilState(userAtom);

  const fetchUser = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "https://pulse-api-server.codewithabhinav.online/api/v1/auth/getUserDetails",
        data: {
          token: token,
        },
      });
      localStorage.setItem("user", JSON.stringify(response.data.data));
      setUser(response.data.data);
      console.log(user);
    } catch (error) {
      toast.dismiss();
      console.log("Invalid Token");
    }
  };

  const [orderData, setOrderData] = useState({
    price: 0,
    quantity: 0,
  });

  const changeHandler = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
      side: activeTab,
      userId: user?.UserId,
      market: market,
    });
    console.log(orderData);
  };

  const clickHandler = async () => {
    try {
      toast.loading("Placing Order");
      const response = await axios({
        method: "post",
        url: "https://pulse-api-server.codewithabhinav.online/api/v1/order",
        data: orderData,
      });
      await fetchUser();
      toast.dismiss();
      toast.success("Order Placed Successfully!");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Failed to place order!");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-[60px]">
        <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
        <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="px-3">
          <div className="flex flex-row gap-5">
            <LimitButton type={type} setType={setType} />
            <MarketButton type={type} setType={setType} />
          </div>
        </div>
        <div className="flex flex-col px-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-normal">Available Balance</p>
              <p className="font-medium text-xs">{`${user?.Balance} USD`}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal">Price</p>
            <div className="relative">
              <input
                step="0.01"
                placeholder="0"
                className="h-12 rounded-lg border-2 border-solid pr-12 text-right text-2xl"
                type="text"
                name="price"
                onChange={changeHandler}
              />
              <div className="absolute right-1 top-1 p-2">
                <img src="/usdc.webp" className="w-6 h-6" alt="usdc" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal">Quantity</p>
            <div className="relative">
              <input
                step="0.01"
                placeholder="0"
                className="h-12 rounded-lg border-2 border-solid pr-12 text-right text-2xl"
                type="text"
                name="quantity"
                onChange={changeHandler}
              />
              <div className="absolute right-1 top-1 p-2">
                <img src="/sol.webp" className="w-6 h-6" alt="sol" />
              </div>
            </div>
            <div className="flex justify-end">
              <p className="font-medium pr-2 text-xs">
                {`~ ${Number(orderData.price) * Number(orderData.quantity)}`}
              </p>
            </div>
            <div className="flex justify-center gap-3 mt-2">
              <div className="rounded-full px-4 py-1 text-xs cursor-pointer">
                25%
              </div>
              <div className="rounded-full px-4 py-1 text-xs cursor-pointer">
                50%
              </div>
              <div className="rounded-full px-4 py-1 text-xs cursor-pointer">
                75%
              </div>
              <div className="rounded-full px-4 py-1 text-xs cursor-pointer">
                Max
              </div>
            </div>
          </div>
          <button
            type="button"
            className={`font-semibold h-12 rounded-xl text-base px-4 py-2 my-4 ${
              activeTab === "sell" ? "bg-red-500" : "bg-greenPrimaryButtonBackground"
            }`}
            onClick={clickHandler}
          >
            {activeTab === "sell" ? "Sell" : "Buy"}
          </button>
          <div className="flex justify-between mt-1">
            <div className="flex gap-2">
              <label className="flex items-center">
                <input className="form-checkbox h-5 w-5 cursor-pointer" type="checkbox" />
                <span className="ml-2 text-xs">Post Only</span>
              </label>
              <label className="flex items-center">
                <input className="form-checkbox h-5 w-5 cursor-pointer" type="checkbox" />
                <span className="ml-2 text-xs">IOC</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LimitButton( type, setType ) {
  return (
    <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType("limit")}>
      <div className={`text-sm font-medium py-1 border-b-2 ${type === "limit" ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis"}`}>
        Limit
      </div>
    </div>
  );
}

function MarketButton( type, setType ) {
  return (
    <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType("market")}>
      <div className={`text-sm font-medium py-1 border-b-2 ${type === "market" ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis"}`}>
        Market
      </div>
    </div>
  );
}

function BuyButton(activeTab, setActiveTab ) {
  return (
    <div
      className={`flex flex-col flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === "buy" ? "border-b-greenBorder bg-greenBackgroundTransparent" : "border-b-baseBorderMed"}`}
      onClick={() => setActiveTab("buy")}
    >
      <p className="text-center text-sm font-semibold text-greenText">Buy</p>
    </div>
  );
}

function SellButton(activeTab, setActiveTab) {
  return (
    <div
      className={`flex flex-col flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === "sell" ? "border-b-redBorder bg-redBackgroundTransparent" : "border-b-baseBorderMed"}`}
      onClick={() => setActiveTab("sell")}
    >
      <p className="text-center text-sm font-semibold text-redText">Sell</p>
    </div>
  );
}
