const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const ARTIFACT = require('../artifacts/contracts/VendingMachine.sol/VendingMachine.json');
require('dotenv').config();
const { CONTRACT } = process.env;

const provider = ethers.getDefaultProvider('http://localhost:8545');
const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const userPK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const myContract = new ethers.Contract(CONTRACT, ARTIFACT.abi, provider);
const iface = new ethers.utils.Interface(ARTIFACT.abi);

router.get('/ping', async function (req, res) {
    res.json({ result: "pong" });
});

router.get('/me', async function (req, res) {
    try {
        const balance = await provider.getBalance(userAddress);
        const ethersValue = ethers.utils.formatEther(BigInt(balance._hex));
        res.json({
            address: userAddress,
            balance: ethersValue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/machine', async function (req, res) {
    try {
        const stock = await myContract.bottlesInStock();
        const balance = await provider.getBalance(CONTRACT);
        res.json({
            address: CONTRACT,
            stock: BigInt(stock._hex).toString(),
            balance: ethers.utils.formatEther(BigInt(balance._hex))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/purchase/:quantity', async function (req, res) {
    try {
        const wallet = new ethers.Wallet(userPK, provider);
        const amount = 0.1 * req.params.quantity;
        const purchase = await myContract.connect(wallet).purchaseMultiple(req.params.quantity, {
            gasLimit: 500_000,
            value: ethers.utils.parseUnits(amount.toString(), "ether")
        });
        let trans = await purchase.wait();
        res.json({ trans });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/block', async function (req, res) {
    try {
        const latestBlock = await provider.getBlock("latest");
        res.json(latestBlock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/block/:number', async function (req, res) {
    try {
        const latestBlock = await provider.getBlock(parseInt(req.params.number));
        res.json(latestBlock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/transaction/:hash', async function (req, res) {
    try {
        const transaction = await provider.getTransaction(req.params.hash);
        const decodedData = iface.parseTransaction({ data: transaction.data, value: transaction.value });
        transaction.value = parseInt(decodedData.value._hex, 16);
        transaction.function = decodedData.name;
        transaction.amount = parseInt(decodedData.args.amount._hex, 16);

        res.json({ transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
