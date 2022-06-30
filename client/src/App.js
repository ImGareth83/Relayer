import React, { useState, useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "react-notifications/lib/notifications.css";

const { config } = require("./config");
const showErrorMessage = (message) => {
  NotificationManager.error(message, "Error", 5000);
};
const showSuccessMessage = (message) => {
  NotificationManager.success(message, "Message", 3000);
};

const showInfoMessage = (message) => {
  NotificationManager.info(message, "Info", 3000);
};

let contract;
let domainData = {
  name: "Transactions",
  version: "1",
  chainId: "42", // Kovan
  verifyingContract: config.contract.address,
};
const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
];

let web3;

function App() {
  const [club, setClub] = useState("Default Club Address");
  const [player, setPlayer] = useState("No Player Selected");
  const [newPlayer, setNewPlayer] = useState("");
  const [newQuote, setNewQuote] = useState("");

  useEffect(() => {
    if (!window.ethereum) {
      showErrorMessage("Metamask is required to use this DApp");
      return;
    }

    const biconomy = new Biconomy(window.ethereum, {
      apiKey: "Rpr68MRGk.8bc42fe6-5b3c-417f-8ded-c4e443472e45",
      debug: true,
    });

    web3 = new Web3(biconomy);

    biconomy
      .onEvent(biconomy.READY, async () => {
        console.log("Biconomy is ready");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(
          config.contract.abi,
          config.contract.address
        );
        startApp();
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.log("error" + error.toString());
        console.log("message" + message);
      });
  }, []);

  const onQuoteChange = (event) => {
    setNewQuote(event.target.value);
  };

  const onPlayerChange = (event) => {
    setNewPlayer(event.target.value);
  };

  async function startApp() {
    console.log("startApp");
    const result = await contract.methods.getPlayerName().call({
      from: window.ethereum.selectedAddress,
    });
    console.log("result", result);
    if (result.currentClub !== "0x0000000000000000000000000000000000000000") {
      setPlayer(result.playerName);
      setClub(result.club);
    } else {
      setPlayer("No Player found");
      setClub("No Club found");
    }
  }
  async function onSubmit() {
    console.log(window.ethereum.selectedAddress);
    setNewPlayer("");
    setNewQuote("");
    console.log("contract:" + contract);

    let nonce = await contract.methods
      .nonces(window.ethereum.selectedAddress)
      .call();

    let message = {};
    message.nonce = parseInt(nonce);
    message.from = window.ethereum.selectedAddress;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message,
    });

    window.web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [window.ethereum.selectedAddress, dataToSign],
      },
      async function (err, result) {
        if (err) {
          return console.error(err);
        }
        console.log("Signature result from wallet :");
        console.log(result);
        if (result && result.result) {
          const signature = result.result.substring(2);
          const r = "0x" + signature.substring(0, 64);
          const s = "0x" + signature.substring(64, 128);
          const v = parseInt(signature.substring(128, 130), 16);
          console.log(r, "r");
          console.log(s, "s");
          console.log(v, "v");
          console.log(window.ethereum.selectedAddress, "userAddress");

          const promiEvent = await contract.methods
            .addPlayer(
              window.ethereum.selectedAddress,
              newPlayer,
              parseInt(newQuote),
              r,
              s,
              v
            )
            .send({
              from: window.ethereum.selectedAddress,
              gas: 1500000,
              gasPrice: "30000000000000",
            });

          promiEvent
            .on("transactionHash", (hash) => {
              showInfoMessage(
                "Transaction sent successfully. Check Console for Transaction hash"
              );
              console.log("Transaction Hash is ", hash);
            })
            .once("confirmation", (confirmationNumber, receipt) => {
              if (receipt.status) {
                showSuccessMessage("Transaction processed successfully");
                startApp();
              } else {
                showErrorMessage("Transaction Failed");
              }
              console.log(receipt, "receiptEvent");
            });
        } else {
          showErrorMessage(
            "Could not get user signature. Check console logs for error"
          );
        }
      }
    );
  }
  return (
    <div className="App">
      *Use this DApp only on Kovan Network
      <header className="App-header">
        <h1>Global Football Player Transfer Registration</h1>
        <section className="main">
          <div className="mb-wrap mb-style-2">
            <h4>{player} </h4>
          </div>

          <div className="mb-attribution">
            <p className="mb-author">club address: {club}</p>
          </div>
        </section>
        <section>
          <div className="submit-container">
            <div className="submit-row">
              <input
                size="100"
                border-radius="15"
                type="text"
                placeholder="Enter your player name"
                onChange={onPlayerChange}
                value={newPlayer}
              />
            </div>

            <div className="submit-row">
              <input
                size="100"
                border-radius="15"
                type="text"
                placeholder="Enter new player fees"
                onChange={onQuoteChange}
                value={newQuote}
              />
            </div>
            <button type="button" className="button" onClick={onSubmit}>
              Submit
            </button>
          </div>
        </section>
      </header>
      <NotificationContainer />
    </div>
  );
}

export default App;
