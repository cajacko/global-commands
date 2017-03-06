# Global Commands
Run commands from any directory. Tired of changing directory all the time in the terminal? Add all your frequent commands into a .globalCommands file on your desktop and run them from within any directory.

This package runs in Node.js, so get download the latest version and install this package with:
```
npm install -g global-commands
```

Now you can setup your frequent commands file. Add a file named .globalCommands to your desktop and base it off the following:
```
{
  "test": "echo 'global command'",
  "startMyProject": {
    "directory": "/Users/username/Documents/Code/Projects/myProject",
    "command": "npm start"
  }
}
```
The file must be a valid JSON object. Each entry must be the command name followed be either:
- The command
- or
- An object specifying the directory to run the command from, and the command itself

You can now run the commands using: 
```
globCom test
```
```
globCom startMyProject
```

etc. 