
var fs = require('fs');

// true = turn on bug demonstration
var demobug = true;

var path = './';
var filename = 'bugdemo.txt';
var size = 0;

var stats = fs.statSync(path+filename);
if(stats.isFile() === true) {
    size = stats.size
    console.log(`${path}${filename} is ${stats.size} bytes in size`);
} else {
    console.log(`${path}${filename} is NOT a file`);
    process.exit(0);
}

if(demobug === true) {
    var fd = fs.openSync(path+filename, 'r');
    console.log(`opened fd(${fd}) ${path}${filename}`);
    var buff = Buffer.alloc(size+10);
    var rdqty = fs.readSync(fd, buff, 'utf8');
    // rdqty will always be zero
    console.log(`readSync - fd(${fd}) ${path}${filename} - returned: ${rdqty}`);
    fs.closeSync(fd);
    var logstr = buff.toString();
} else {
    var logstr = fs.readFileSync(path+filename, 'utf8');         
    var rdqty = logstr.length;
    console.log(`readFileSync - ${path}${filename} - size of data: ${rdqty}`);
}




