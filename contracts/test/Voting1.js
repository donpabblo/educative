const { expect } = require("chai");

var contractAddress = "";

describe("Voting", function () {
  it("Deployment", async function () {
    const contract = await ethers.getContractFactory("Voting");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Check candidates", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const bobResponse = await contract.votes(0);
    expect(bobResponse).to.equal(1);
    const aliceResponse = await contract.votes(1);
    expect(aliceResponse).to.equal(1);
  });
});
