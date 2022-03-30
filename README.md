# Basic Greeting Contract with Hardhat

# Localhost

- npm run node:localhost
- npm run deploy:localhost
- npm start

# Ropsten

- set ROPSTEN_PRIVATE_KEY as env var `export ROPSTEN_PRIVATE_KEY=0x...`
- npm run deploy:ropsten
- npm start

# App

- Set the address contract to the return value of running `npm run deploy:xxx`
- Set the new value and sign the transaction using Metamask
