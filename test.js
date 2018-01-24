var shell = require('shelljs');
var child = shell.exec('node --version', {async:true});
child.stdout.on('data', function(data) {
    console.log("Data from shell: ",data)
});