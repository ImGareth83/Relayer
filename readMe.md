# Design and implement a simple relayer service that will batch user submitted transactions and submit multiple transactions in one meta-transaction

The web client is a simple site that aims to capture player name and fees associated with the transfer.

It uses EIP712 to sign the these information

Users need not pay any gas fees as the contract signed will be send the site's relayer. The relayer is powered by Biconomy where the actually smart contract is stored. The relayer handles the all the incoming transaction and the contract owners can pay the gas fees via the relayer.

Even though the site is able to sign the transaction, there is an error when executing the addPlayer transaction.

## Available Scripts

In the project directory, you can run the web client:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:4002](http://localhost:4002) to view it in your browser.

## Author

- Website - [Gareth's Linkedin](https://www.linkedin.com/in/garethfong/)

## Acknowledgments

I used many of materials from Biconomy and their sample apps
