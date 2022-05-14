import React, { useState } from "react";

const { ethereum } = window;
export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  return (
    <Context.Provider value={{ currentAccount, connectWallet }}>
      {children}
    </Context.Provider>
  );
};
