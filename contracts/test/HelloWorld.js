const { expect } = require("chai");

var contractAddress = "";

describe("HelloWorld", function () {
  it("Deployment", async function () {
    const contract = await ethers.getContractFactory("HelloWorld");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Read message", async function () {
    const contract = await hre.ethers.getContractAt("HelloWorld", contractAddress);
    const txResponse = await contract.message();
    expect(txResponse).to.equal("Hello, World!");
  });
  it("Write message", async function () {
    const contract = await hre.ethers.getContractAt("HelloWorld", contractAddress);
    const txResponse = await contract.setMessage("Hello", {
      gasLimit: 500_000,
    });
    const txReceipt = await txResponse.wait();
    expect(txReceipt.gasUsed).to.be.greaterThan(0);
  });
  it("Read message", async function () {
    const contract = await hre.ethers.getContractAt("HelloWorld", contractAddress);
    const txResponse = await contract.message();
    expect(txResponse).to.equal("Hello");
  });
});
