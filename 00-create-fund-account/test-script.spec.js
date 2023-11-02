import test from 'tape';

import main from './script-create-fund-account.js';

test('base', async function (t) {
    let result;
    try {
        result = await main();
    } catch (ex) {
        t.fail(ex);
    } finally {
        t.match(result.accountId.toString(), /0\.0\.\d+/,
            'valid format for accountId');
        t.match(result.accountBalanceString.toString(), /[\d\,]+\.\d{8}/,
            'valid format for accountBalanceString');
        t.equal(result.accountExplorerUrl.toString(),
            `https://hashscan.io/testnet/account/${result.accountId.toString()}`,
            'accountExplorerUrl corresponds to accountId');
        t.pass('all assertions completed');
    }
});
