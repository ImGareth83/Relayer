const HDWalletProvider = require("@truffle/hdwallet-provider");
const { projectId, mnemonic } = require("./secrets.json");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://kovan.infura.io/v3/${projectId}`
        ),
      network_id: 42,
      gas: 6000000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
