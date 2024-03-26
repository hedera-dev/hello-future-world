import test from 'tape';

import main from './script-hcs-topic.js';

test('hwseq-hcs', async function (pt) {
    let result;

    pt.test('base', async function(t) {
        try {
            result = await main();
        } catch (ex) {
            t.fail(ex);
        } finally {
            // accountId,
            // topicId,
            // topicExplorerUrl,
            // topicCreateTxId,
            // topicMsgSubmitTxId,
            // topicCreateTxReceipt,
            // topicMsgSubmitTxReceipt,
            // topicMessageMirrorUrl,
            t.pass('script completed');
        }
    });

    pt.test('accountId', async function(t) {
        t.match(result.accountId.toString(), /^\d+\.\d+\.\d+$/,
            'valid format for accountId');
    });

    pt.test('topicId', async function(t) {
        t.match(result.topicId.toString(), /^\d+\.\d+\.\d+$/,
            'valid format for topicId');
    });

    pt.test('topicExplorerUrl', async function(t) {
        t.match(result.topicExplorerUrl.toString(), /^https:\/\/hashscan.io\/testnet\/topic\/\d+\.\d+\.\d+$/,
            'valid format for topicExplorerUrl');
        t.assert(result.topicExplorerUrl.toString().endsWith(result.topicId.toString()),
            'topicExplorerUrl matches topicId');
    });

    pt.test('topicCreateTxId', async function(t) {
        t.match(result.topicCreateTxId.toString(), /^\d+\.\d+\.\d+\@\d+\.\d+$/,
            'valid format for topicCreateTxId');
    });

    pt.test('topicMsgSubmitTxId', async function(t) {
        t.match(result.topicMsgSubmitTxId.toString(), /^\d+\.\d+\.\d+\@\d+\.\d+$/,
            'valid format for topicMsgSubmitTxId');
    });

    pt.test('topicCreateTxReceipt', async function(t) {
        t.equal(result.topicCreateTxReceipt.status.toString(), 'SUCCESS',
            'topicCreateTxReceipt status SUCCESS');
        t.equal(result.topicMsgSubmitTxReceipt.status.toString(), 'SUCCESS',
            'topicMsgSubmitTxReceipt status SUCCESS');
    });

    pt.test('topicMsgSubmitTxReceipt', async function(t) {
        t.equal(result.topicMsgSubmitTxReceipt.status.toString(), 'SUCCESS',
            'topicMsgSubmitTxReceipt status SUCCESS');
        t.equal(result.topicMsgSubmitTxReceipt.status.toString(), 'SUCCESS',
            'topicMsgSubmitTxReceipt status SUCCESS');
    });

    pt.test('topicMessageMirrorUrl', async function(t) {
        t.match(result.topicMessageMirrorUrl.toString(), /^https:\/\/testnet.mirrornode.hedera.com\/api\/v1\/topics\/\d+\.\d+\.\d+\/messages\/\d+$/,
            'valid format for topicMessageMirrorUrl');
        t.assert(result.topicMessageMirrorUrl.toString().endsWith(result.topicMsgSubmitTxReceipt.topicSequenceNumber.toString()),
            'topicMessageMirrorUrl matches topicSequenceNumber');
    });

    pt.test('topicMessageMirrorUrl-api-response', async function(t) {
        let apiResult;
        try {
            // It takes a few seconds for the message to propagate
            console.log('Waiting 5s...');
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const apiResponse = await fetch(result.topicMessageMirrorUrl, {
                method: 'GET',
                accept: 'application/json',
            });
            apiResult = await apiResponse.json();
            console.log(result.topicMessageMirrorUrl);
            console.log(JSON.stringify(apiResult, undefined, 2));
        } catch (ex) {
            t.fail(ex);
        } finally {
            t.equal(apiResult.sequence_number.toString(),
                result.topicMsgSubmitTxReceipt.topicSequenceNumber.toString(),
                'mirror response sequence number match');
            t.equal(apiResult.topic_id.toString(),
                result.topicId.toString(),
                'mirror response topic ID match');
            t.assert(Buffer.from(apiResult.message.toString(), 'base64').toString('utf-8').startsWith('Hello HCS - '),
                'mirror response topic ID match');
        }
    });
});
