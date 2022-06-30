var Transactions = artifacts.require("Transactions");

module.exports = async function (deployer) {
  const instance = await deployer.deploy(Transactions);
  console.log("Deployed ", Transactions.address);
};
