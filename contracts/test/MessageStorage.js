const { expect } = require("chai");

var contractAddress = "";

describe("MessageStorage", function () {
  it("Deployment", async function () {
    const contract = await ethers.getContractFactory("MessageStorage");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Write simple message", async function () {
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.setMessage("Hello", {
      gasLimit: 500_000,
    });
    const txReceipt = await txResponse.wait();
    expect(txReceipt.gasUsed).to.be.greaterThan(0);
  });
  it("Read simple message", async function () {
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.getMessage();
    expect(txResponse).to.equal("Hello");
  });
  it("Write personal message fails because insufficient funds", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    try {
      const txResponse = await contract.writePersonalMessage(recipient.address, "Hello friend", {
        gasLimit: 500_000,
        value: 999
      });
      const txReceipt = await txResponse.wait();
    } catch(err) {
      expect(err.message).contains("Unsufficient funds");
    }
  });
  it("Write personal message success", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.writePersonalMessage(recipient.address, "Hello friend", {
      gasLimit: 500_000,
      value: 1000
    });
    const txReceipt = await txResponse.wait();
    expect(txReceipt.gasUsed).to.be.greaterThan(0);
  });
  it("Check read is false", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.connect(recipient).checkRead();
    expect(txResponse).to.be.false;
  });
  it("Write another personal message before reading fails", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    try {
      const txResponse = await contract.writePersonalMessage(recipient.address, "Second message", {
        gasLimit: 500_000,
        value: 1000
      });
      await txResponse.wait();
    } catch (err) {
      expect(err.message).contains("Previous message not read");
    }
  });
  it("Read personal message success", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.connect(recipient).readPersonalMessage();
    expect(txResponse).to.equal("Hello friend");
  });
  it("Mark as read success", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.connect(recipient).markAsRead();
    const txReceipt = await txResponse.wait();
    expect(txReceipt.gasUsed).to.be.greaterThan(0);
  });
  it("Check read is true", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("MessageStorage", contractAddress);
    const txResponse = await contract.connect(recipient).checkRead();
    expect(txResponse).to.be.true;
  });
});
