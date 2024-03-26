import * as url from 'node:url';
import {
    Client,
    AccountId,
    PrivateKey,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
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

    // NOTE: Create a topic
    // Step (1) in the accompanying tutorial
    //  const topicCreateTx = await
    //     /* ... */;
    //    .freezeWith(client);
    const topicCreateTx = await
        new TopicCreateTransaction()
        .freezeWith(client);
    const topicCreateTxSigned = await topicCreateTx.sign(accountKey);
    const topicCreateTxResponse = await topicCreateTxSigned.execute(client);
    const topicCreateTxReceipt = await topicCreateTxResponse.getReceipt(client);
    const topicCreateTxId = topicCreateTxResponse.transactionId;
    const topicId = topicCreateTxReceipt.topicId;

    const topicExplorerUrl = `https://hashscan.io/testnet/topic/${topicId.toString()}`;

    // Need to wait a few seconds for topic to register
    console.log('Topic created. Waiting 5s...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Publish a message to this topic
    // NOTE: Publish message to topic
    // Step (2) in the accompanying tutorial
    //  const topicCreateTx = await
    //     /* ... */;
    //    .freezeWith(client);
    const topicMsgSubmitTx = await
        new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: 'Hello HCS - bguiz',
        })
        .freezeWith(client);
    const topicMsgSubmitTxSigned = await topicMsgSubmitTx.sign(accountKey);
    const topicMsgSubmitTxResponse = await topicMsgSubmitTxSigned.execute(client);
    const topicMsgSubmitTxId = topicMsgSubmitTx.transactionId;
    const topicMsgSubmitTxReceipt = await topicMsgSubmitTxResponse.getReceipt(client);

    const topicMessageMirrorUrl =
        `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId.toString()}/messages/${topicMsgSubmitTxReceipt.topicSequenceNumber.toString()}`;

    client.close();

    // output results
    console.log(`accountId: ${accountId}`);
    console.log(`topicId: ${topicId}`);
    console.log(`topicExplorerUrl: ${topicExplorerUrl}`);
    console.log(`topicCreateTxId: ${topicCreateTxId}`);
    console.log(`topicMsgSubmitTxId: ${topicMsgSubmitTxId}`);
    console.log(`topicMessageMirrorUrl: ${topicMessageMirrorUrl}`);

    return {
        accountId,
        topicId,
        topicExplorerUrl,
        topicCreateTxId,
        topicMsgSubmitTxId,
        topicMessageMirrorUrl,
        topicCreateTxReceipt,
        topicMsgSubmitTxReceipt,
    };
}

if (import.meta.url.startsWith('file:')) {
    const modulePath = url.fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) {
        main();
    }
}

export default main;
