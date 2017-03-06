#!/usr/bin/env node

const fs = require('fs');
const winston = require('./winston');
const settings = require('./settings');
const commandLineCommands = require('command-line-commands');
const prompt = require('prompt');
const directoryExists = require('directory-exists');
const run = require('./run');
const listAll = require('./listAll');
const runInteractive = require('./runInteractive');

const validCommands = [null, 'run', 'ls', 'add', 'unset'];
const { command, argv } = commandLineCommands(validCommands);

switch (command) {
  case null:
    runInteractive();
    break;
  case 'run':
    if (argv.length) {
      winston.log('info', 'Run command');

      const dir = settings.get(argv[0]);

      if (!dir) {
        winston.log('error', `${argv[0]} is not a saved command`);
        listAll();
        throw new Error(`${argv[0]} is not a saved command`);
      }

      const params = argv;

      params.shift();
      const script = params.shift();

      run(dir, script, params);
    } else {
      runInteractive();
    }

    break;
  case 'add': {
    // TODO: Allow add via command line
    prompt.start();

    const schema = {
      properties: {
        name: {
          pattern: /^[a-zA-Z:-_]+$/,
          message: 'Command name must not contain spaces',
          required: true,
          description: 'Enter a name for this command'
        },
        directory: {
          required: true,
          description: 'Enter the path to your projects package.json file'
        },
      }
    };

    prompt.get(schema, (err, result) => {
      if (!directoryExists.sync(result.directory)) {
        throw new Error(`${result.directory} is not a valid directory`);
      }

      settings.set(result.name, result.directory);
      winston.log('info', `${result.name} command added with directory: ${result.directory}`);
    });

    break;
  }

  case 'ls': {
    if (argv.length) {
      if (argv.length > 1) {
        throw new Error('Only one argument can be passed to ls');
      }

      const dir = settings.get(argv[0]);

      if (!dir) {
        throw new Error(`${argv[0]} command does not exist`);
      }

      const packageJsonFile = `${dir}/package.json`;
      const packageJsonRaw = fs.readFileSync(packageJsonFile);
      let packageJson;

      try {
        packageJson = JSON.parse(packageJsonRaw);
      } catch (err) {
        throw err;
      }

      if (!packageJson.scripts) {
        throw new Error(`${packageJsonFile} does not have any scripts`);
      }

      const scriptKeys = Object.keys(packageJson.scripts);

      if (!scriptKeys || !scriptKeys.length) {
        throw new Error(`${packageJsonFile} does not have any scripts`);
      }

      const scripts = packageJson.scripts;

      winston.log('info', '');
      winston.log('info', 'AVAILABLE COMMANDS:');
      scriptKeys.map(script => winston.log('info', `  ${script}: `, scripts[script]));
      winston.log('info', '');
    } else {
      listAll();
    }

    break;
  }

  case 'unset':
    // Unset prompt if no commands
    if (argv && argv.length) {
      argv.map(arg => settings.unset(arg));
    }

    break;
  default:
    throw new Error('Unknown command specified');
}
