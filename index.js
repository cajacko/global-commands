#!/usr/bin/env node

const fs = require('fs');
const spawn = require('child_process').spawn;
const winston = require('winston');

let configFile;
let config;

if (process.platform === 'win32') {
  configFile = `${process.env.USERPROFILE}\\Desktop\\`;
} else {
  configFile = `${process.env.HOME}/Desktop/`;
}

configFile += '.globalCommands';

try {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (err) {
  winston.log('error', 'Could not read .globalCommands from your Desktop! Make sure you escape any \\ in your .globalCommands');
  throw err;
}

const param = process.argv[2];

if (!param) {
  throw new Error('No command specified');
}

const command = config[param];

if (!command) {
  throw new Error('Command does not exist in .globalCommands on the Desktop');
}

let execute;
const options = {};

if (typeof command === 'object') {
  if (!command.directory) {
    throw new Error(`No directory paramater given for ${param} in .globalCommands Either specify a command as a string or an object with a directory and command property`);
  }

  if (!command.command) {
    throw new Error(`No command paramater given for ${param} in .globalCommands Either specify a command as a string or an object with a directory and command property`);
  }

  options.cwd = command.directory;
  execute = command.command;
} else {
  execute = command;
}

const parts = execute.split(' ');
let cmd = '';
const args = [];

parts.forEach((part, index) => {
  let initCommand = part;

  if (initCommand === 'npm' && process.platform === 'win32') {
    initCommand += '.cmd';
  }

  if (index === 0) {
    cmd = initCommand;
  } else {
    args.push(initCommand);
  }
});

winston.log('info', cmd, parts);

try {
  const ls = spawn(cmd, args, options);

  ls.stdout.on('data', (data) => {
    winston.log('info', data.toString());
  });

  ls.stderr.on('data', (data) => {
    winston.log('info', data.toString());
  });

  ls.on('exit', (code) => {
    winston.log('error', `child process exited with code ${code.toString()}`);
  });
} catch (err) {
  winston.log('error', 'Could not run command');
  throw err;
}
