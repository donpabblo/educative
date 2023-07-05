const { expect } = require("chai");

var contractAddress = "";

describe("Voting", function () {
  it("Deployment", async function () {
    const contract = await ethers.getContractFactory("Voting");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Check candidates", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const bobResponse = await contract.votes(0);
    expect(bobResponse).to.equal(1);
    const aliceResponse = await contract.votes(1);
    expect(aliceResponse).to.equal(1);
  });
  it("Check voters", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const bobResponse = await contract.voters('0x8fA8016921a4Cd240433e8fA872b7750Ee3A66d9');
    expect(bobResponse).to.be.true;
    const aliceResponse = await contract.voters('0xA0FcD37Ce5AB17541d5D928fE153d8ea135b7ffB');
    expect(aliceResponse).to.be.true;
  });
  it("Check totalVotes function", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const response = await contract.totalVotes();
    expect(response).to.equal(2);
    const accounts = await ethers.getSigners();
    let txResponse = await contract.connect(accounts[2]).vote(0);
    await txResponse.wait();
    const secondResponse = await contract.totalVotes();
    expect(secondResponse).to.equal(3);
  });
  it("Check vote for Bob", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const txResponse = await contract.vote(0);
    await txResponse.wait();
    const bobVotes = await contract.votes(0);
    expect(bobVotes).to.equal(3);
  });
  it("Check vote for Alice", async function () {
    const [owner, account1] = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const txResponse = await contract.connect(account1).vote(1);
    await txResponse.wait();
    const aliceVotes = await contract.votes(1);
    expect(aliceVotes).to.equal(2);
  });
  it("Check double voting not possible", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    await expect(contract.vote(0)).to.be.rejectedWith(Error);
  });
  it("Check unable to retrieve the winner if votes less than 10", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    await expect(contract.winner()).to.be.rejectedWith(Error);
  });
  it("Check votes less than 10 when voting", async function () {
    const accounts = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    for (let c = 3; c < 8; c++) {
      let txResponse = await contract.connect(accounts[c]).vote(c % 2);
      await txResponse.wait();
    }
    await expect(contract.connect(accounts[8]).vote(1)).to.be.rejectedWith(Error);
  });
});

describe("Check winner logic", function () {
  it("Check Alice wins", async function () {
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    const bobVotes = await contract.votes(0);
    expect(bobVotes).to.equal(5);
    const aliceVotes = await contract.votes(1);
    expect(aliceVotes).to.equal(5);
    const txResponse = await contract.winner();
    expect(txResponse).to.equal(1);
  });
  it("New deployment", async function () {
    const contract = await ethers.getContractFactory("Voting");
    const deployed = await contract.deploy();
    contractAddress = deployed.address;
  });
  it("Check Bob wins", async function () {
    const accounts = await ethers.getSigners();
    const contract = await hre.ethers.getContractAt("Voting", contractAddress);
    for (let c = 0; c < 8; c++) {
      let txResponse = await contract.connect(accounts[c]).vote(0);
      await txResponse.wait();
    }
    const bobVotes = await contract.votes(0);
    expect(bobVotes).to.equal(9);
    const aliceVotes = await contract.votes(1);
    expect(aliceVotes).to.equal(1);
    const txResponse = await contract.winner();
    expect(txResponse).to.equal(0);
  });
});
