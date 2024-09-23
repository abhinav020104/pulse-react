import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import { Appbar } from './components/Appbar';
import Deposit from "./Deposit"
import axios from 'axios';
import Holdings from './Holdings';
import Login from './Login';
import SignUp from "./Signup"
function App() {
  const token = localStorage.getItem("token");
  const fetchUser = async() =>{
        try{
            const response = await axios({
                method:"post",
                    url:"https://pulse-api-server.codewithabhinav.online/api/v1/auth/getUserDetails",
                    data:{
                      token:token
                    }
                })
                localStorage.setItem("user" , JSON.stringify(response.data.data));
        }catch(error){
            console.log(error); 
        }
}
    useEffect(()=>{
    // toast.loading("Fetching User!");
    fetchUser();
} , [token])
  return (
    <div>
      <Toaster/>
      <Appbar></Appbar>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/deposit' element={<Deposit/>}></Route>
        <Route path='/holdings' element={<Holdings/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
