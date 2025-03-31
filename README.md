## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

# Fund Me Project

This repository contains a Fund Me project built using Foundry for smart contract development and Vite + React for the frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) and npm (Node Package Manager)
- `make`

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mtmarctoni/foundry-fundme.git
    cd foundry-fundme
    ```

2.  **Install Foundry dependencies (using Makefile):**

    ```bash
    make install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the Project

### 1. Start Anvil Network

Open a new terminal and start the Anvil local blockchain:

    ```bash
    anvil
    ```

This will usually start a local Ethereum network on `http://127.0.0.1:8545`.

**Important:** Ensure you add this url to your .env file for the 'HOST_ADDRESS' variable.

### 2. Deploy the Smart Contract

In a separate terminal, deploy the Fund Me contract using Foundry in the anvil local network:

    ```bash
    make deploy-host
    ```

This will deploy the contract to the local anvil network. After successful deployment, you will see the contract address in the terminal output.

### 3. Update Frontend Configuration

Update the frontend configuration with the deployed contract address.

1.  Locate the deploy contract address. It will be located in `foundry-fundme/broadcast/FundMe.s.sol/31337/run-latest.json` after deployment.

    ```json
    {
      //...
      "contractName": "FundMe",
      "contractAddress": "0xYourContractAddress"
      //...
    }
    ```

2.  Copy the contract address.
3.  Navigate to the `frontend/src/config/contract-address.json` file.
4.  Update the `contractAddress` with the copied values.

**Important:** Ensure you replace `0xYourContractAddress` with the actual values from your deployment.

### 4. Start the Frontend

Navigate to the `frontend` directory and start the Vite development server:

    ```bash
    cd frontend
    npm run dev
    ```

This will start the React application, and you can access it in your browser at the URL displayed in the terminal (usually `http://localhost:5173`).

### 5. Interact with the Smart Contract

You can now interact with the Fund Me smart contract through the frontend interface. You can fund the contract, withdraw funds, and view the contract's balance and owners.

## Configuration (.env)

The Makefile uses environment variables defined in a `.env` file. Create a `.env` file in the root directory of the project and add your configuration:

```
    HOST_ADDRESS="http://127.0.0.1:8545"
    DEFAULT_ANVIL_KEY=""
    SEPOLIA_RPC_URL=""
    ETHERSCAN_API_KEY=""
```

## Testing

To run the smart contract tests:

```bash
forge test -vvvv
```
