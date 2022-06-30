const { expect } = require("chai");

const Transactions = artifacts.require("Transactions");

contract("Box", function () {
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.Transactions = await Transactions.new();
  });

  // Test case
  it("retrieve returns a value previously stored", async function () {
    // Store a value
    await this.Transactions.store(42);

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await this.Transactions.retrieve()).toString()).to.equal("42");
  });
});
