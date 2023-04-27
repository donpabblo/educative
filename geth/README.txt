ACCOUNTS
	Node1: geth account new --datadir nodeA
	Node2: geth account new --datadir nodeB

INIT
	bootnode -genkey boot.key
	geth init --datadir nodeA genesis.json
	geth init --datadir nodeB genesis.json

START BOOTNODE
bootnode -nodekey boot.key -addr 127.0.0.1:30305

START NODE 1
geth --datadir nodeA --port 30306 --discovery.port 30307 --bootnodes "enode://408c82839e1c6f700ed714ff79e409177e7e94a1f2690dbe18ca0b2818624ab006d5e7f99a7d51f41295692b6da9c63639538331c6e9da86c7220b40e6f89c57@127.0.0.1:0?discport=30305" --networkid 12345 --unlock 0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a --password password.txt --authrpc.port 8551 --ipcpath nodeA\geth.ipc --mine --miner.threads 1 -nat extip:127.0.0.1 --syncmode full --miner.etherbase 0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a

START NODE 2			
geth --datadir nodeB --port 30308 --discovery.port 30309 --bootnodes "enode://408c82839e1c6f700ed714ff79e409177e7e94a1f2690dbe18ca0b2818624ab006d5e7f99a7d51f41295692b6da9c63639538331c6e9da86c7220b40e6f89c57@127.0.0.1:0?discport=30305" --networkid 12345 --unlock 0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE --password password.txt --authrpc.port 8552 --ipcpath nodeB\geth.ipc --mine --miner.threads 1 -nat extip:127.0.0.1 --syncmode full --miner.etherbase 0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE

ATTACH TO IPC ENDPOINT
geth attach \\.\pipe\nodeA\geth.ipc
geth attach /blockchain/nodeA/nodeAgeth.ipc
geth attach \\.\pipe\nodB\geth.ipc
- admin.peers
- net
web3.personal.unlockAccount(web3.personal.listAccounts[0], null, 300)

eth.sendTransaction({
  to: '0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE',
  from: '0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a',
  value: web3.toWei(1, "ether")
});

eth.sendTransaction({
  to: '0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a',
  from: '0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE',
  value: web3.toWei(1, "ether")
});

eth.getBalance("0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a")
eth.getBalance("0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE")
web3.fromWei(eth.getBalance("0xB134860824326bdF27fAd8A8F2EBD92303DdeA6a"))
web3.fromWei(eth.getBalance("0xA20Dc648435df0962A1C29C3A8baA27a8ebAf7bE"))

eth.getTransaction('0x2301689ab4f363fcdc5c991a76823fa442f7fb1eee2f954253c3032745829ab7');
