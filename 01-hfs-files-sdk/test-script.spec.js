import test from 'tape';

import main from './script-hfs-files-sdk.js';

test('base', async function (t) {
    let result;
    try {
        result = await main();
    } catch (ex) {
        t.fail(ex);
    } finally {
        t.match(result.fileId.toString(), /0\.0\.\d+/,
            'valid format for fileId');
        t.match(result.fileCreateTxId.toString(), /0\.0\.\d+\@\d+\.\d+/,
            'valid format for fileCreateTxId');
        t.equal(result.localFileContents.toString(), result.networkFileContents.toString(),
            'localFileContents same as networkFileContents');
        t.equal(result.txExplorerUrl.toString(),
            `https://hashscan.io/testnet/transaction/${result.fileCreateTxId.toString()}`,
            'txExplorerUrl corresponds to fileCreateTxId');
        t.pass('all assertions completed');
    }
});
