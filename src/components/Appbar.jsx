import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { RecoilRoot, useRecoilState } from "recoil";
import { tokenAtom, userAtom } from "../store/User"; 
import { PrimaryButton, SuccessButton } from "./core/Button"; 
import { LogoutModal } from "./LogoutModal"; 

export const Appbar = () => {
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const [token, setToken] = useRecoilState(tokenAtom);
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [user, setUser] = useRecoilState(userAtom);

    const loginNavigator = () => {
        navigate("/login");
    };

    const signUpNavigator = () => {
        navigate("/signup");
    };

    const openLogoutModal = () => {
        setLogoutModalOpen(true);
    };

    const closeLogoutModal = () => {
        setLogoutModalOpen(false);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser({});
        closeLogoutModal();
        navigate("/");
    };

    return (
        <RecoilRoot>
            <div className="text-white border-b border-slate-800">
                <div className="flex justify-between items-center p-2">
                    <div className="flex">
                        <div className="text-xl pl-4 flex flex-col justify-center cursor-pointer text-white" onClick={() => navigate('/')}>
                            Pulse
                        </div>
                        <button onClick={() => navigate('/markets')}>
                            <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${location.pathname.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`}>
                                Markets
                            </div>
                        </button>
                        <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${location.pathname.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`} onClick={() => navigate('/trade/SOL_USD')}>
                            Trade
                        </div>
                    </div>
                    <div className="flex">
                        <div className="p-2 mr-2">
                            {token !== null ? (
                                <div>
                                    <SuccessButton onClick={() => navigate("/deposit")}>Deposit</SuccessButton>
                                    <SuccessButton onClick={() => navigate("/holdings")}>My Holdings</SuccessButton>
                                    <PrimaryButton onClick={() => navigate("/account")}>My Account</PrimaryButton>
                                    <PrimaryButton onClick={openLogoutModal}>Logout</PrimaryButton>
                                </div>
                            ) : (
                                <div>
                                    <PrimaryButton onClick={loginNavigator}>Login</PrimaryButton>
                                    <PrimaryButton onClick={signUpNavigator}>Sign Up</PrimaryButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} onConfirm={confirmLogout} />
        </RecoilRoot>
    );
};
