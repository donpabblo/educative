const { expect } = require("chai");

var contractAddress = "";

describe("VendingMachine", function () {
  it("Deployment", async function () {
    const contract = await ethers.getContractFactory("VendingMachine");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Check initial stock is 100", async function () {
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    const txResponse = await contract.bottlesInStock();
    expect(txResponse).to.equal(100);
  });
  it("Check owner", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    const txResponse = await contract.owner();
    expect(txResponse).to.equal(owner.address);
  });
  it("User restock fails", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    try {
      const txResponse = await contract.connect(account1).restock(10, {
        gasLimit: 500_000
      });
      await txResponse.wait();
    } catch (err) {
      expect(err.message).contains("Only owner can restock the bottles");
    }
  });
  it("Owner restock success", async function () {
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    const txResponse = await contract.restock(10, {
      gasLimit: 500_000
    });
    await txResponse.wait();
    const txStock = await contract.bottlesInStock();
    expect(txStock).to.equal(110);
  });
  it("Purchasing 1 bottle fails because not enough ETH", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    try {
      const txResponse = await contract.connect(account1).purchase({
        gasLimit: 500_000,
        value: 1000
      });
      await txResponse.wait();
    } catch (err) {
      expect(err.message).contains("You must pay at least 0.1 ether");
    }
  });
  it("Purchasing 1 bottle success", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    const txResponse = await contract.connect(account1).purchase({
      gasLimit: 500_000,
      value: ethers.utils.parseEther("0.1")
    });
    await txResponse.wait();
    const txStock = await contract.bottlesInStock();
    expect(txStock).to.equal(109);
    const txBalance = await contract.purchased(account1.address);
    expect(txBalance).to.equal(1);
  });
  it("Purchasing 10 bottles fails because not enough ETH", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    try {
      const txResponse = await contract.connect(account1).purchaseMultiple(10, {
        gasLimit: 500_000,
        value: ethers.utils.parseEther("0.9")
      });
      await txResponse.wait();
    } catch (err) {
      expect(err.message).to.not.be.null;
    }
  });
  it("Purchasing 10 bottles success", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    const txResponse = await contract.connect(account1).purchaseMultiple(10, {
      gasLimit: 500_000,
      value: ethers.utils.parseEther("1")
    });
    await txResponse.wait();
    const txStock = await contract.bottlesInStock();
    expect(txStock).to.equal(99);
    const txBalance = await contract.purchased(account1.address);
    expect(txBalance).to.equal(11);
  });
  it("Purchasing 99 bottles fails because out of stock", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("VendingMachine", contractAddress);
    try {
      const txResponse = await contract.connect(account1).purchaseMultiple(150, {
        gasLimit: 500_000,
        value: ethers.utils.parseEther("15")
      });
      await txResponse.wait();
    } catch (err) {
      expect(err.message).to.not.be.null;
    }
  });


});
