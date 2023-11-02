import test from 'tape';

import main from './script-hts-ft.js';

test('base', async function (t) {
    let result;
    try {
        result = await main();
    } catch (ex) {
        t.fail(ex);
    } finally {
        t.match(result.accountId.toString(), /0\.0\.\d+/,
        'valid format for accountId');
        t.match(result.tokenId.toString(), /0\.0\.\d+/,
            'valid format for tokenId');
        t.equal(result.tokenExplorerUrl.toString(),
            `https://hashscan.io/testnet/token/${result.tokenId.toString()}`,
            'tokenExplorerUrl corresponds to tokenId');
        t.equal(result.accountBalanceToken.toString(),
            '1000000',
            'accountBalanceToken corresponds to initial supply');
        t.equal(result.accountBalanceFetchApiUrl.toString(),
            `https://testnet.mirrornode.hedera.com/api/v1/accounts/${result.accountId.toString()}/tokens?token.id=${result.tokenId.toString()}&limit=1&order=desc`,
            'accountBalanceFetchApiUrl corresponds to accountId and tokenId');
        t.pass('all assertions completed');
    }
});
