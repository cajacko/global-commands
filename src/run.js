const winston = require('winston');
const spawn = require('child_process').spawnSync;

module.exports = function run(dir, script, params) {
  const windowsEnvironment = /^win/.test(process.platform);
  let runScript;
  let runParams = [];
  let cmd;

  if (script) {
    runScript = script;
  } else {
    runScript = 'start';
  }

  if (params && params.length) {
    runParams = params;
  }

  if (windowsEnvironment) {
    cmd = 'npm.cmd';
  } else {
    cmd = 'npm';
  }

  const args = ['run', runScript].concat(runParams);

  try {
    spawn(cmd, args, { cwd: dir, stdio: 'inherit' });
  } catch (err) {
    winston.log('error', 'Could not run command');
    throw err;
  }
};
