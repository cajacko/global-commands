const winston = require('winston');
const spawn = require('child_process').spawn;

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
    const ls = spawn(cmd, args, { cwd: dir });

    ls.stdout.on('data', (data) => {
      winston.log('info', data.toString());
    });

    ls.stderr.on('data', (data) => {
      winston.log('info', data.toString());
    });

    ls.on('exit', (code) => {
      winston.log('info', `child process exited with code ${code.toString()}`);
    });
  } catch (err) {
    winston.log('error', 'Could not run command');
    throw err;
  }
};
