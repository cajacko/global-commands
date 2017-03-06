const winston = require('./winston');
const settings = require('./settings');

module.exports = function listAll() {
  const commands = settings.get();
  winston.log('info', '');
  winston.log('info', 'AVAILABLE COMMANDS:');
  Object.keys(commands).map(name => winston.log('info', `  ${name}: `, commands[name]));
  winston.log('info', '');
};
