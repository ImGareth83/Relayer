const TestTransactions = artifacts.require("Transactions");

contract("Transactions", (accounts) => {
  it("should assert true", async () => {
    await TestTransactions.deployed();
    return assert.isTrue(true);
  });
});
