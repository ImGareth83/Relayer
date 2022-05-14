import React, { useContext } from "react";
import "./App.css";

import { Context } from "../web3/Context";

export const App = () => {
  const { connectWallet } = useContext(Context);
  const connectWalletBtn = (
    <button className="connect-wallet-button" onClick={connectWallet}>
      Connect Wallet
    </button>
  );

  return (
    <div className="App">
      <h1>Welcome</h1>
      {connectWalletBtn}
    </div>
  );
};
