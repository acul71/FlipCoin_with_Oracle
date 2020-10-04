# FLIP COIN with ORACLE

A simple bet game with solidity using an Oracle (provableAPI.sol) for randomness
You bet some ether and you can loose all or double the stake.
You can see a demo video here: 
https://github.com/acul71/FlipCoin_with_Oracle/video/

You have to edit the truffle-config.js file and create a .secret text file in the root directory of the project with the Metamask seed to make it work!
The solidity contracts are in the contracts directory
The html start file is index.html and in assets you find the included files
To open the file in a browser (with metamask installed) you have to do in bash in the project root folder:
```bash
python -m http.server
```
to simulate a web server.


- Installation

Clone the repository:
```bash
git clone https://github.com/acul71/FlipCoin_with_Oracle
```

Install this package with npm:
```bash
npm install --save-dev @truffle/hdwallet-provider
```

Do
```bash
truffle init
```
to create a new project

Then edit truffle-config.js and uncomment:
```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "fj4jll3k.....";
//
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
```

HDWalletProvider is a tool that helps with transactions sign
infuriaKey is a key you get from infuria. Infuria is an API that let us access to blockchain info without having to mantain a node.
fs is a library for dealing with files
mnemonic is the wallet seed that we put in .secret file

Than we uncomment the configuration for ropstien (test) network:
```javascript
ropsten: {
  provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
  network_id: 3, // Ropsten's id
  gas: 5500000, // Ropsten has a lower block limit than mainnet
  confirmations: 2, // # of confs to wait between deployments. (default: 0)
  timeoutBlocks: 200, // # of blocks before a deployment times out (minimum/default: 50)
  skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
},
```

Register on https://infura.io/ and copy the key (project secret) in infuriaKey
than copy the api end point (select ropsten) https://ropsten.infura.io/v3/...... in ropsten provider
Then put the metamask (wallet) seed frase in .secret file in the root of your project (don't share this file put in .gitignore) 

Set the compiler version:
```javascript
// Configure your compilers
  compilers: {
    solc: {
      version: "0.5.12",    // Fetch exact version from solc-bin (default: truffle's version)
```

To deploy the project do this in the project folder:
```bash
truffle deploy --network ropsten
```
But you need to have (free) ropsten ether: go here https://faucet.metamask.io/

