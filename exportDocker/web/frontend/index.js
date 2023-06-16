const errorDiv = document.getElementById('error');
const loader = document.querySelector("#loader");
const mainCanvas = document.querySelector("#mainCanvas");
const modal = document.querySelector("#myModal");
const blockdata = document.querySelector("#blockdata");

var currentBlock = 0;
var htmlTemp = '<div class="block" id="block_0"><div>GENESIS</div></div>';

function userInfo() {
    loader.style.display = "block";
    errorDiv.style.display = "none";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'api/me', true);
    xmlHttp.responseType = 'json';
    xmlHttp.onload = function () {
        var status = xmlHttp.status;
        if (status === 200) {
            document.querySelector("#address").innerHTML = "EOA: " + xmlHttp.response.address;
            document.querySelector("#balance").innerHTML = "Balance: <strong>" + xmlHttp.response.balance + " ETH</strong>";
        } else {
            errorDiv.style.display = "block";
            errorDiv.textContent = JSON.stringify(xmlHttp.response);
        }
        loader.style.display = "none";
    }
    xmlHttp.send();
}

function machineInfo() {
    loader.style.display = "block";
    errorDiv.style.display = "none";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'api/machine', true);
    xmlHttp.responseType = 'json';
    xmlHttp.onload = function () {
        var status = xmlHttp.status;
        if (status === 200) {
            document.querySelector("#contract-address").innerHTML = "Contract Address: " + xmlHttp.response.address;
            document.querySelector("#stock").innerHTML = "Available Bottles: <strong>" + xmlHttp.response.stock + "</strong> bottles";
            document.querySelector("#bottlelHelp").textContent = "Max " + xmlHttp.response.stock + " bottles";
            document.querySelector("#machine-balance").innerHTML = "Machine Balance: <strong>" + xmlHttp.response.balance + " ETH</strong>";
        } else {
            errorDiv.style.display = "block";
            errorDiv.textContent = JSON.stringify(xmlHttp.response);
        }
        loader.style.display = "none";
    }
    xmlHttp.send();
}

function onPurchase() {
    let qty = document.getElementById('bottles').value;
    loader.style.display = "block";
    errorDiv.style.display = "none";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'api/purchase/' + qty, true);
    xmlHttp.responseType = 'json';
    xmlHttp.onload = function () {
        var status = xmlHttp.status;
        if (status === 200) {
            console.log(xmlHttp.response);
            userInfo();
            machineInfo();
            addBlock();
        } else {
            errorDiv.style.display = "block";
            errorDiv.textContent = xmlHttp.response.error;
        }
        loader.style.display = "none";
    }
    xmlHttp.send();
}

function addBlock() {
    currentBlock++;
    htmlTemp += '<div class="block" id="block_' + currentBlock + '" style="left: ' + (180 * currentBlock) + 'px"><div>Block ' + currentBlock + '</div><button class="btn btn-primary" onclick="showBlockInfo(' + currentBlock + ')">Data</button></div>';
    htmlTemp += '<div class="connector block_' + (currentBlock) + ' block_' + (currentBlock - 1) + '"><img src="arrow.gif" class="connector-start"><img src="arrow.gif" class="connector-end"></div>';
    mainCanvas.innerHTML = htmlTemp;
    canvases = new Array();
    initPageObjects();
}

function getBlockInfo(number) {
    return new Promise((resolve, reject) => {
        loader.style.display = "block";
        errorDiv.style.display = "none";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'api/block/' + number, true);
        xmlHttp.responseType = 'json';
        xmlHttp.onload = function () {
            var status = xmlHttp.status;
            if (status === 200) {
                resolve(xmlHttp.response);
            } else {
                reject(xmlHttp.response);
            }
            loader.style.display = "none";
        }
        xmlHttp.send();
    });
}

function getTransactionInfo(hash) {
    return new Promise((resolve, reject) => {
        loader.style.display = "block";
        errorDiv.style.display = "none";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'api/transaction/' + hash, true);
        xmlHttp.responseType = 'json';
        xmlHttp.onload = function () {
            var status = xmlHttp.status;
            if (status === 200) {
                resolve(xmlHttp.response);
            } else {
                reject(xmlHttp.response);
            }
            loader.style.display = "none";
        }
        xmlHttp.send();
    });
}

function showBlockInfo(blockNumber) {
    blockdata.innerHTML = "";
    getBlockInfo(blockNumber).then(data => {
        modal.style.display = "block";
        blockdata.innerHTML = '<p>Block Number: ' + data.number + '</p>';
        blockdata.innerHTML += '<p>Block Hash: ' + data.hash + '</p>';
        blockdata.innerHTML += '<strong>Transactions (' + data.transactions.length + ')</strong>';
        for (let trans of data.transactions) {
            getTransactionInfo(trans).then(data => {
                blockdata.innerHTML += '<div class="panel panel-default transaction">' + 
                '<p>Hash: ' + data.transaction.hash + '</p>' +
                '<p>Index: ' + data.transaction.transactionIndex + '</p>' +
                '<p>From: ' + data.transaction.from + '</p>' +
                '<p>To: 0x5FbDB2315678afecb367f032d93F642f64180aa3</p>' +
                '<p>Value: 100000000000000000 wei</p>' +
                '<p>Nonce: ' + data.transaction.nonce + '</p>' +
                '</div>';
            }).catch(err => {
                modal.style.display = "none";
                errorDiv.style.display = "block";
                errorDiv.textContent = JSON.stringify(err);
            });
        }
    }).catch(err => {
        modal.style.display = "none";
        errorDiv.style.display = "block";
        errorDiv.textContent = JSON.stringify(err);
    })
}

function closeModal() {
    modal.style.display = "none";
}

window.addEventListener('load', async () => {
    userInfo();
    machineInfo();
    document.querySelector("#purchase-btn").addEventListener("click", onPurchase);
});