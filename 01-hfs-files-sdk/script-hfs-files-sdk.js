import fs from 'node:fs/promises';
import {
    Client,
    AccountId,
    PrivateKey,
    FileCreateTransaction,
    FileContentsQuery,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

async function main() {
    // Ensure required environment variables are available
    dotenv.config();
    if (!process.env.ACCOUNT_ID ||
        !process.env.ACCOUNT_PRIVATE_KEY) {
        throw new Error('Please set required keys in .env file.');
    }

    // Configure client using environment variables
    const accountId = AccountId.fromString(process.env.ACCOUNT_ID);
    const accountKey = PrivateKey.fromStringECDSA(process.env.ACCOUNT_PRIVATE_KEY);
    const client = Client.forTestnet().setOperator(accountId, accountKey);

    // Read file from disk
    const localFileContents = await fs.readFile(
        './my-file.txt', { encoding: 'utf8' });

    // Write file onto Hedera Testnet, using HFS FileCreateTransaction
    const fileCreateTx = new FileCreateTransaction()
        // NOTE: File create transaction
        // Step (1) in the accompanying tutorial
        // /* ... */
        .setContents(localFileContents.toString())
        .freezeWith(client);
    const fileCreateTxSigned = await fileCreateTx.sign(accountKey);
    const fileCreateTxSubmitted = await fileCreateTxSigned.execute(client);
    const fileCreateTxId = fileCreateTxSubmitted.transactionId;
    const fileCreateTxReceipt = await fileCreateTxSubmitted.getReceipt(client);
    const fileId = fileCreateTxReceipt.fileId;

    // Read file from Hedera Testnet, using HFS FileContentsQuery
    const fileReadQuery = new FileContentsQuery()
        // NOTE: File contents query
        // Step (2) in the accompanying tutorial
        // /* ... */;
        .setFileId(fileId);
    const networkFileContents = await fileReadQuery.execute(client);

    // Output results
    const txExplorerUrl = `https://hashscan.io/testnet/transaction/${fileCreateTxId}`;
    console.log(`fileId: ${fileId}`);
    console.log(`fileCreateTxId: ${fileCreateTxId}`);
    console.log(`txExplorerUrl: ${txExplorerUrl}`);
    console.log(`localFileContents: ${localFileContents}`);
    console.log(`networkFileContents: ${networkFileContents}`);

    client.close();

    return {
        fileId,
        fileCreateTxId,
        txExplorerUrl,
        localFileContents,
        networkFileContents,
    };
}

main();

export default main;
