const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8551');
const contractOwner = provider.getSigner();
const user = provider.getSigner(1);

async function run() {
    const balance = await provider.getBalance(contractOwner.getAddress());
    console.log(ethers.utils.formatEther(balance));
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});