"use client"
import { atom } from "recoil";
const userAtom = atom({
    key:"userAtom",
    //@ts-ignore
    default:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
})

const tokenAtom = atom({
    key:"tokenAtom",
    //@ts-ignore
    default:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
})

const AccountAtom = atom({
    key:"AccountAtom",
    default:{},
})

const PaymentAtom = atom({
    key:"PaymentAtom",
    default:null,
})

const signUpAtom = atom({
    key:"signUpAtom",
    default:{}
})

const otpVerificationAtom = atom({
    key:"otpVerificationAtom",
    default:{},
})

const loadingAtom = atom({
    key:"loadingAtom",
    default : false
})
export {userAtom , tokenAtom , AccountAtom , PaymentAtom , signUpAtom , otpVerificationAtom , loadingAtom }

