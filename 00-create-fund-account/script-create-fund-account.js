import {
    Client,
    AccountId,
    PrivateKey,
    AccountBalanceQuery,
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
    // NOTE: Initialise account using `Client`
    // Step (1) in the accompanying tutorial
    // const client = Client.forTestnet().setOperator(/* ... */);
    const client = Client.forTestnet().setOperator(accountId, accountKey);

    // Query tHBAR balance using AccountBalanceQuery,
    // and convert to tinybars
    // NOTE: Obtain the balance of the account
    // Step (2) in the accompanying tutorial
    // const accountBalance = /* ... */
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
    // NOTE: Convert balance result object to Hbars
    // Step (3) in the accompanying tutorial
    // const accountBalanceHbars = /* ... */;
    const accountBalanceHbars = accountBalance.hbars.toBigNumber();
    const accountBalanceString = new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
        })
        .format(accountBalanceHbars);

    // Output results
    const accountExplorerUrl = `https://hashscan.io/testnet/account/${accountId}`;
    console.log(`accountId: ${accountId}`);
    console.log(`accountBalanceTinybars: ${accountBalanceString}`);
    console.log(`accountExplorerUrl: ${accountExplorerUrl}`);

    client.close();

    return {
        accountId,
        accountBalanceString,
        accountExplorerUrl,
    };
}

main();

export default main;
