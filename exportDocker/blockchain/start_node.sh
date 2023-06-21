geth --datadir {{DATA_DIR}} --port {{NODE_LISTEN_PORT}} --discovery.port {{NODE_DISCOVERY_PORT}} --bootnodes "{{BOOTNODE}}" --networkid {{CHAIN_ID}} --unlock {{NODE_ADDRESS}} --password password.txt --mine --miner.threads {{MINER_THREADS}} -nat {{NAT}} --syncmode {{SYNC_MODE}} --miner.etherbase {{MINER_ETHERBASE}}