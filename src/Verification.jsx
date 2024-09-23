import { useState } from "react";
import OtpInput from "otp-input-react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { otpVerificationAtom, signUpAtom } from "../../store/User"; // Ensure Recoil is set up correctly in your React app
import { useNavigate } from "react-router-dom"; // For navigation
import toast from "react-hot-toast";

const Verification = () => {
  const [otp, setOtp] = useState("");
  const [OtpData, setOtpData] = useRecoilState(otpVerificationAtom);
  const signUpdata = useRecoilValue(signUpAtom);
  const navigate = useNavigate(); 

  async function clickHandler() {
    try {
      await OtpData.confirm(otp);
      const response = await axios({
        method: "post",
        url: "https://pulse-api-server.codewithabhinav.online/api/v1/auth/signup",
        data: signUpdata,
      });
      toast.success("SignUp successful");
      navigate("/"); 
    } catch (error) {
      console.log(error);
      console.log("Error during OTP verification");
      toast.error("OTP verification failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-slate-700 p-8 rounded-lg shadow-lg max-w-[400px] h-[300px] w-full text-center flex items-center flex-col justify-center">
        <h2 className="text-[1.5rem] font-bold text-white mb-6">Verify OTP</h2>
        <OtpInput
          OTPLength={6}
          otpType="number"
          disabled={false}
          autoFocus
          value={otp}
          onChange={setOtp}
          inputStyle={{
            width: "3rem",
            height: "3rem",
            margin: "0.5rem",
            fontSize: "2rem",
            borderRadius: "0.5rem",
            border: "2px solid #000", 
            backgroundColor: "#fff",
            color: "#000",
            outline: "none", 
          }}
          className="otp-input mb-6"
        />
        <button
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={clickHandler}
        >
          Verify And Sign Up
        </button>
      </div>
    </div>
  );
};

export default Verification;
