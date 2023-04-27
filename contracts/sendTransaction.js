const { ethers } = require("ethers");
const contractInfo = require("./artifacts/contracts/VendingMachine.sol/VendingMachine.json");

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const contractOwner = provider.getSigner();
const user = provider.getSigner(1);

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function run() {
    const vendingMachineContract = new ethers.Contract(contractAddress, contractInfo.abi, provider);
    const txResponse = await vendingMachineContract.connect(user).purchase({
        gasLimit: 500_000,
        value: ethers.utils.parseEther("0.1")
    });
    const receipt = await txResponse.wait();
    console.log(receipt);
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});