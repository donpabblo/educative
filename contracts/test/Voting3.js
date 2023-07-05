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
  it("Check voters", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const bobResponse = await contract.voters('0x8fA8016921a4Cd240433e8fA872b7750Ee3A66d9');
    expect(bobResponse).to.be.true;
    const aliceResponse = await contract.voters('0xA0FcD37Ce5AB17541d5D928fE153d8ea135b7ffB');
    expect(aliceResponse).to.be.true;
  });
  it("Check totalVotes function", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const response = await contract.totalVotes();
    expect(response).to.equal(2);
  });
});
