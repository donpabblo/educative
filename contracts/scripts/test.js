const { ethers, ContractFactory } = require("ethers");
const contractInfo = require("../artifacts/contracts/VendingMachine.sol/VendingMachine.json");

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const contractOwner = provider.getSigner();
const user = provider.getSigner(1);

var contractAddress = "";

async function deploy() {
    const factory = new ContractFactory(contractInfo.abi, contractInfo.bytecode, contractOwner);
    const contract = await factory.deploy();
    contractAddress = contract.address;
}
async function run() {
    //await deploy();
    const balance = await provider.getBalance(contractOwner.getAddress());
    console.log(ethers.utils.formatEther(balance));
    console.log(await contractOwner.getAddress());
    const vendingMachineContract = new ethers.Contract(contractAddress, contractInfo.abi, provider);
    const owner = await vendingMachineContract.owner();
    console.log(owner);

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