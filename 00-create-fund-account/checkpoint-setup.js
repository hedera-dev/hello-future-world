#!/usr/bin/env node

import path from 'node:path';
import util from 'node:util';
import child_process from 'node:child_process';
import url from 'node:url';

const exec = util.promisify(child_process.exec);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function main() {
  console.log('git check:');
  const gitRemoteCliExec = await exec('git remote -v');
  if (gitRemoteCliExec.stderr) {
    console.log('git error:');
    console.error(gitRemoteCliExec.stderr);
  } else if (!gitRemoteCliExec.stdout.match(/github\.com\:[a-z,A-Z,0-9,\-,\_]+\/hello-future-world\.git/gm)) {
    console.log('git remote mismatch:');
    console.error(gitRemoteCliExec.stdout);
  } else {
    console.log('OK!');
  }

  console.log('git version check:');
  const gitVersionCliExec = await exec('git --version');
  if (gitVersionCliExec.stderr) {
    console.log('git version error:');
    console.error(gitVersionCliExec.stderr);
  } else {
    const gitVersionStr = gitVersionCliExec.stdout.split(' ')[2];
    const [gitSemverMajor, gitSemverMinor] = gitVersionStr.split('.');
    if ((gitSemverMajor < 2) ||
        (gitSemverMajor == 2 && gitSemverMinor < 37)) {
        console.log('git version mismatch:');
        console.error(gitVersionCliExec.stdout);
    } else {
        console.log('OK!');
    }
  }

  console.log('node version check:');
  const nodeVersionCliExec = await exec('node --version');
  if (nodeVersionCliExec.stderr) {
    console.log('node version error:');
    console.error(nodeVersionCliExec.stderr);
  } else if (new Number(nodeVersionCliExec.stdout.split('.')[0].substring(1)) < 18) {
    console.log('node version mismatch:');
    console.error(nodeVersionCliExec.stdout);
  } else {
    console.log('OK!');
  }

  console.log('npm version check:');
  const npmVersionCliExec = await exec('npm --version');
  if (npmVersionCliExec.stderr) {
    console.log('npm version error:');
    console.error(npmVersionCliExec.stderr);
  } else {
    const [npmSemverMajor, npmSemverMinor] = npmVersionCliExec.stdout.split('.');
    if ((npmSemverMajor < 9) ||
        (npmSemverMajor == 9 && npmSemverMinor < 5)) {
        console.log('git version mismatch:');
        console.error(npmVersionCliExec.stdout);
    } else {
        console.log('OK!');
    }
  }

  console.log('npm install check:');
  const npmLsCliExec = await exec('npm ls');
  if (npmLsCliExec.stderr) {
    console.log('npm error:');
    console.error(npmLsCliExec.stderr);
  } else if (!npmLsCliExec.stdout.match(/\@hashgraph\/sdk\@/gm)) {
    console.log('npm ls mismatch:');
    console.error(npmLsCliExec.stdout);
  } else {
    console.log('OK!');
  }

  console.log('.env file check:');
  const dotEnvFilePath = path.resolve(__dirname, './.env');
  const lsCliExec = await exec(`ls ${dotEnvFilePath}`);
  if (lsCliExec.stderr) {
    console.log('ls error:');
    console.error(lsCliExec.stderr);
  } else if (!lsCliExec.stdout.match(/\.env/gm)) {
    console.log('ls mismatch:');
    console.error(lsCliExec.stdout);
  } else {
    console.log('OK!');
  }

  console.log('shell check:');
  const shellCheckCliExec = await exec(`$( ps -o pid,args | awk '$1=='"$$"'{print $2}' ) --version`);
  if (shellCheckCliExec.stderr) {
    console.log('shell check error:');
    console.error(shellCheckCliExec.stderr);
  } else {
    console.log('OK!');
  }
  // NOTE that shell version is not checked, only that it is present

  // NOTE that code editor is not checked
}

main();
