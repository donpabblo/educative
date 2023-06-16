const { task } = require("hardhat/config");
const { writeConfig } = require("./helpers");

task("deploy", "Deploys contract")
    .setAction(async function (taskArguments, hre) {
        const contract = await hre.ethers.getContractFactory("VendingMachine");
        const contractVendingMachine = await contract.deploy();
        const address = contractVendingMachine.address;
        console.log(`VendingMachine contract deployed to address: ${address}`);
        writeConfig(address);
    });