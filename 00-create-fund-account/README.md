## Create and fund an account

## What you will accomplish

- ✅ Create an account on Hedera Testnet
- ✅ Fund this new account with tHBAR

## Tutorial

This repo, [`github.com/hedera-dev/hello-future-world`](https://github.com/hedera-dev/hello-future-world/),
is intended to be used alongside the tutorial,
[`docs.hedera.com/tutorials/hello-world/create-fund-account`](https://docs.hedera.com/tutorials/hello-world/create-fund-account/).

----

The following is a static copy of the tutorial,
and may be out of date.
Please refer to the linked tutorial for the best experience!

----

## Prerequisites

Before you begin, you should be familiar with the following:

- ✅ Javascript syntax

You should have the following set up on your computer:

- ✅ `git` installed
	- Minimum version: 2.37
	- [Install Git (Github)](https://github.com/git-guides/install-git)
- ✅ NodeJs + `npm` installed
	- Minimum version of NodeJs: 18
	- Minimum version of `npm`: 9.5
	- Recommended for Linux & Mac: [`nvm`](https://github.com/nvm-sh/nvm)
	- Recommended for Windows: [`nvm-windows`](https://github.com/coreybutler/nvm-windows)
- ✅ POSIX-compliant shell
	- For Linux & Mac: The shell that ships with the operating system will work. Either `bash` or `zsh` will work.
	- For Windows: The shell that ships with the operating system (`cmd.exe`, `powershell.exe`) will *not* work. Recommended alternatives: WSL/2, or git-bash which ships with git-for-windows.

## Steps

### Set up project

To follow along, start with the `main` branch,
which is the *default branch* of this repo.
This gives you the initial state from which you can follow along
with the steps as described in the tutorial.

```shell
git clone git@github.com:hedera-dev/hello-future-world.git
```

In the terminal, make a `.env` file by copying the provided `.env.sample` file.
Then open that file in a code editor, such as VS code (`code`).

```shell
cd 00-create-fund-account/
cp .env.sample .env
code .env
```

### Create account

Visit the Hedera Portal, and create a Testnet account.

[![localhost-init-step-03][5]][5]

Copy-paste the confirmation code sent to your email.

[![localhost-init-step-04][6]][6]

Fill out this form.

[![localhost-init-step-05][7]][7]

In the top-left select Hedera Testnet from the drop-down.

[![localhost-init-step-06a][8]][8]

From the next screen that shows your accounts,
copy the value of "DER encoded private key",
and replace `YOUR_OPERATOR_KEY` in the `.env` file with it.

[![ocalhost-init-step-06b-07][9]][9]

From the same screen, copy the value of "Account ID", and replace `YOUR_OPERATOR_ID` in the `.env` file with it.

For example, if your Account ID is `0.0.123`,
and your DER encoded private key is `302e0201234`,
the 2 lines in your `.env` file should look like this:

```text
ACCOUNT_ID=0.0.123
ACCOUNT_PRIVATE_KEY=302e0201234
```

🎉 Now you are ready to start using your Hedera Testnet account
from the portal within script files on your computer! 🎉

### Write the script

An almost-complete script has already been prepared for you,
and you will only need to make a few modifications (outlined below)
for it to run successfully.

First, install the dependencies using `npm`.
Then open the script file in a code editor.

```shell
npm install
code script-create-fund-account.js
```

#### Step 1: Initialise account using `Client`

Initialise the `client` instance by invoking the `setOperator` method,
and passing in `accountId` and `accountKey` as parameter.

```javascript
    const client = Client.forTestnet().setOperator(accountId, accountKey);
```

Now the `client` instance represents and operates your account.

#### Step 2: Obtain the balance of the account

Use the `AccountBalanceQuery` method to obtain the tHBAR balance of your account.

```javascript
    const accountBalance = await new AccountBalanceQuery()
```

Note that the return value is an object, and needs to be parsed.

#### Step 3: Convert balance result object to Hbars

Parse that return value to extract its tHBAR balance,
so that you may convert into a string for display purposes.

```javascript
    const accountBalanceHbars = accountBalance.hbars.toBigNumber();
```

### Run the script

Run the script using the following command:

```shell
node script-create-fund-account.js
```

You should see output similar to the following:

```text
accountId: 0.0.1186
accountBalanceTinybars: 10,000.00000000
accountExplorerUrl: https://hashscan.io/testnet/account/0.0.1186
```

Open the URL, that was output as `accountExplorerUrl` above,
in your browser and check that:

- (1) The accounts exists.
- (2) The balance matches.

## Cheat sheet

To skip ahead to the final state, use the `completed` branch.
This gives you the final state with which you can compare
your implementation to the completed steps of the tutorial.

```shell
git fetch origin completed:completed
git checkout completed
```

To see the full set of differences between
the initial and final states of the repo,
you can use `diff`.

```shell
cd 00-create-fund-account/
git diff main..completed -- ./
```

Alternatively, you may view the diff rendered on Github:
[`hedera-dev/hello-future-world/compare/main..completed`](https://github.com/hedera-dev/hello-future-world/compare/main..completed)
(Note that this will show the `diff` for *all* sequences.)

Note that the branch names are delimited by `..`, and not by `...`,
as the latter finds the `diff` with the latest common ancestor commit,
which *is not* what we want in this case.

----

  [5]: https://i.stack.imgur.com/tgkvS.png
  [6]: https://i.stack.imgur.com/4H9XT.png
  [7]: https://i.stack.imgur.com/atW69.png
  [8]: https://i.stack.imgur.com/2A2ua.png
  [9]: https://i.stack.imgur.com/MrBx0.png
