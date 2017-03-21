import {exec} from 'child_process';

const [_, watchDir,] = process.argv;

const gitDir =  `${watchDir}/.git`;
const dirArg = `--git-dir ${gitDir}`;
const gitCmd = `git ${dirArg}`;

function mkGitCmd(argStr) {
    return `${gitCmd} ${argStr}`;
}

function gitFetch() {
    return new Promise((resolve) => {
        exec(mkGitCmd('fetch'), (err) => {
            if(err) { throw err; }
            resolve(null);
        });
    });
}

function gitGetStatus() {
    return new Promise((resolve) => {
        exec(mkGitCmd('status'), (err, stdout) => {
            if(err) { throw err; }
            resolve(stdout);
        });
    });
}

async function checkGit() {
    console.log('Checking git...');
    await gitFetch();
    console.log('Did fetch');
    const gitStatus = await gitGetStatus();
    console.log(gitStatus);
}

(async function main() {
    (function tryCheck() {
        try {
            checkGit();
        } catch (e) {
            console.error('Git check failed', e);
        }
        setTimeout(tryCheck, 5000);
    })();
})();
