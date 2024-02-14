const { gitDescribeSync } = require('git-describe');
const { version } = require('../package.json');
const { resolve, relative, parse } = require('path');
const { writeFileSync, readFileSync } = require('fs-extra');
const execSync = require('child_process').execSync;
const gitCommand = 'git rev-parse --abbrev-ref HEAD';

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false
});

const currentBranch = execSync(gitCommand).toString().trim();
const releases = [];
const changelog = readFileSync('CHANGELOG.md');
changelog.toString().split(/\r?\n/).forEach(line => {
  if (line.startsWith('#### ')) {
    const parsed = /####\s\[(?<ver>.+) \((?<verDate>.+)\)\]/.exec(line);
    if (parsed.groups) {
      releases.push({
        release: parsed.groups['ver'],
        date: parsed.groups['verDate'],
      });
    }
  }
});

gitInfo.branch = currentBranch === 'main' ? '' : currentBranch;
gitInfo.version = version;
gitInfo.releases = releases;

const file = resolve(__dirname, '..', 'src', 'environments', 'version.ts');
writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECK IN!
/* tslint:disable */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */`,
  { encoding: 'utf-8' }
);

console.log(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`);
