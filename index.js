var fs = require('fs')
var spawn = require('child_process').spawn

try {
  var config = JSON.parse(fs.readFileSync(process.env.USERPROFILE + '\\Desktop\\.globalCommands', 'utf8'));
} catch(err) {
  console.log('Could not read .globalCommands from your Desktop! Make sure you escape any \\ in your .globalCommands')
  throw err
}

var param = process.argv[2]

if (!param) {
  throw "No command specified"
}

var command = config[param]

if (!command) {
  throw "Command does not exist in .globalCommands on the Desktop"
}

var execute
var options = {}

if (typeof command === 'object') {
  if (!command.directory) {
    throw 'No directory paramater given for ' + param + ' in .globalCommands Either specify a command as a string or an object with a directory and command property'
  }

  if (!command.command) {
    throw 'No command paramater given for ' + param + ' in .globalCommands Either specify a command as a string or an object with a directory and command property'
  }

  options.cwd = command.directory
  execute = command.command
} else {
  execute = command
}

var parts = execute.split(' ')
var cmd = ''
var args = []

parts.forEach(function(part, index) {
  if (part == 'npm') {
    part += '.cmd'
  }

  if (index == 0) {
    cmd = part
  } else {
    args.push(part)
  }
})

var ls = spawn(cmd, args, options)

ls.stdout.on('data', function (data) {
  console.log(data.toString());
});

ls.stderr.on('data', function (data) {
  console.log(data.toString());
});

ls.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});