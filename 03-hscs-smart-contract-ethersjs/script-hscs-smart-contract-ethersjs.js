import fs from 'node:fs/promises';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ContractFactory } from '@ethersproject/contracts';
import dotenv from 'dotenv';

async function main() {
    // Ensure required environment variables are available
    dotenv.config();
    if (!process.env.ACCOUNT_ID ||
        !process.env.ACCOUNT_PRIVATE_KEY ||
        !process.env.RPC_URL) {
        throw new Error('Please set required keys in .env file.');
    }
    const rpcUrl = process.env.RPC_URL;
    const accountId = process.env.ACCOUNT_ID;
    const accountKey = process.env.ACCOUNT_PRIVATE_KEY;
    
    // initialise account
    const rpcProvider = new JsonRpcProvider(
        rpcUrl,
    );
    const accountWallet = new Wallet(accountKey, rpcProvider);
    const accountAddress = accountWallet.address;
    const accountExplorerUrl =
        `https://hashscan.io/testnet/address/${accountAddress}`;

    // deploy smart contract
    const abi = await fs.readFile(
        './my_contract_sol_MyContract.abi', { encoding: 'utf8' });
    const evmBytecode = await fs.readFile(
        './my_contract_sol_MyContract.bin', { encoding: 'utf8' });
    // NOTE: Prepare smart contract for deployment
    // Step (2) in the accompanying tutorial
    // const myContractFactory = new ContractFactory(/* ... */);
    const myContractFactory = new ContractFactory(
        abi, evmBytecode, accountWallet);
    const myContract = await myContractFactory.deploy();
    await myContract.deployTransaction.wait();
    const myContractAddress = myContract.address;
    const myContractExplorerUrl =
        `https://hashscan.io/testnet/address/${myContractAddress}`;

    // write data to smart contract
    // NOTE: Invoke a smart contract transaction
    // Step (3) in the accompanying tutorial
    // const myContractWriteTxRequest = await myContract.functions.introduce(/* ... */);
    const myContractWriteTxRequest = await myContract.functions.introduce('bguiz');
    const myContractWriteTxReceipt = await myContractWriteTxRequest.wait();
    const myContractWriteTxHash = myContractWriteTxReceipt.transactionHash;
    const myContractWriteTxExplorerUrl =
        `https://hashscan.io/testnet/transaction/${myContractWriteTxHash}`;

    // read data from smart contract
    // NOTE: Invoke a smart contract query
    // Step (4) in the accompanying tutorial
    // const [myContractQueryResult] = await /* ... */;
    const [myContractQueryResult] = await myContract.functions.greet();

    // output results
    console.log(`accountId: ${accountId}`);
    console.log(`accountAddress: ${accountAddress}`);
    console.log(`accountExplorerUrl: ${accountExplorerUrl}`);
    console.log(`myContractAddress: ${myContractAddress}`);
    console.log(`myContractExplorerUrl: ${myContractExplorerUrl}`);
    console.log(`myContractWriteTxHash: ${myContractWriteTxHash}`);
    console.log(`myContractWriteTxExplorerUrl: ${myContractWriteTxExplorerUrl}`);
    console.log(`myContractQueryResult: ${myContractQueryResult}`);

    return {
        accountId,
        accountAddress,
        accountExplorerUrl,
        myContractAddress,
        myContractExplorerUrl,
        myContractWriteTxHash,
        myContractWriteTxExplorerUrl,
        myContractQueryResult,
    };
}

main();

export default main;
