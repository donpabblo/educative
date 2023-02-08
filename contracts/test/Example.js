const { expect } = require("chai");

var contractAddress = "";

async function bal(label) {
  const [owner] = await ethers.getSigners();
  const bal = await owner.getBalance();
  console.log("BALANCE after:", label, ethers.utils.formatUnits(bal, "gwei"));
}

describe("Test", function () {
  it("Deployment", async function () {
    await bal("INITIAL");

    const Example = await ethers.getContractFactory("Example");
    const example = await Example.deploy();
    contractAddress = example.address;
    console.log(contractAddress);
  });
  it("Estimation", async function () {
    await bal("Deployment");

    const contract = await hre.ethers.getContractAt("Example", contractAddress);

    const gasCostMul = await contract.estimateGas.multiplication(5, 5);
    console.log(gasCostMul.toString());

    const gasCostElev = await contract.estimateGas.addition(5, 5);
    console.log(gasCostElev.toString());

    const gasCostBal = await contract.estimateGas.balance("0x976EA74026E726554dB657fA54763abd0C3a0aa9");
    console.log(gasCostBal.toString());

    const gasCostHash = await contract.estimateGas.hash("PaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaoloPaolo");
    console.log(gasCostHash.toString());

  });
  it("Call setOwner", async function () {
    await bal("Estimation");

    const contract = await hre.ethers.getContractAt("Example", contractAddress);
    const txResponse = await contract.setOwner("0x08001f350afCbF4eccA29ef5f805739b2E3EC8aC", {
      gasLimit: 500_000,
    });
    const txReceipt = await txResponse.wait();
    console.log(txReceipt.gasUsed);
  });
  it("Call addition", async function () {
    await bal("setOwner");

    const contract = await hre.ethers.getContractAt("Example", contractAddress);
    const txResponse = await contract.addition(1, 3);
    console.log(txResponse);
  });
  it("Call infinite", async function () {
    await bal("addition");

    try {
      const contract = await hre.ethers.getContractAt("Example", contractAddress);
      const txResponse = await contract.infinite({
        gasLimit: 500_000,
      });
      console.log(txResponse);
    } catch (err) {
      //console.log(err);
      console.log("BALANCE:", await bal("infinite"));
    } finally {
      await bal("infinite");
    }
  });

  it("Call multiplication", async function () {
    await bal("infinite");

    const contract = await hre.ethers.getContractAt("Example", contractAddress);
    const txResponse = await contract.multiplication(3, 3);
    console.log(txResponse);
    await bal("multiplication");

  });



});
