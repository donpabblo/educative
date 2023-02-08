const { ethers, ContractFactory } = require("ethers");
const contractInfo = require("../artifacts/contracts/VendingMachine.sol/VendingMachine.json");

const provider = new ethers.providers.JsonRpcProvider();
const contractOwner = provider.getSigner();
const user = provider.getSigner(1);

async function main() {
    factory = new ContractFactory(contractInfo.abi, contractInfo.bytecode, contractOwner);
    contract = await factory.deploy();
    const contractAddress = contract.address;
    const balance = await provider.getBalance(contractOwner.getAddress());
    console.log(ethers.utils.formatEther(balance));
    console.log(await contractOwner.getAddress());
    console.log(contractAddress);
    //const contractAddress = "0x08859b2c515a994b10c22f91090992FEB2a60032";
    const VendingMachine = new ethers.Contract(contractAddress, contractInfo.abi, provider);
    const owner = await VendingMachine.owner();
    console.log(owner);
    //0x08859b2c515a994b10c22f91090992FEB2a60032
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});