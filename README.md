# Node.js `fs.readSync()` Bug

While I was working on one of my Node.js projects I ran into a strange bug. And it was occurring in code that was working flawlessly and assumed to be bug free. 

The development of the application was done under Windows and Node.js v12.18.4, and the target platform was Linux with Node.js v12.16.1 on a armv7l hardware platform(*a networked NAS device*).

## Description

When `fs.readSync()` is called with the appropriate parameters it does not read the file. No errors are generated and the only indication that something is wrong is that `fs.readSync()` returns `0` and not the quantity of bytes read.

This bug seems to be specific to v12.16.1. The same code has been tried with 12.18.4 and no issues are seen.

### Testing

I used `nvm` to enable Node.js v12.16.1 on the Windows platform and veriifed the same unwanted behavior of `fs.readSync()`. No other versions of Node.js have been tested *at this time*.

## Work Around

The project where this was discovered needed to use the "sync" functions for file access. And my initial implementation used `fs.openSync()` to open the file and return a file descriptor.

The solution was to replace the the code using the file descriptor with a single call to `fs.readFileSync()`. This works as expected under both platforms and tested versions of Node.js.

### Code

```
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
    console.log(`readSync - fd(${fd}) ${path}${filename} - returned: ${rdqty}`);
    fs.closeSync(fd);
    var logstr = buff.toString();
} else {
    var logstr = fs.readFileSync(path+filename, 'utf8');         
    var rdqty = logstr.length;
    console.log(`readFileSync - ${path}${filename} - size of data: ${rdqty}`);
}
```

# Summary

I would think that the failing code's *functionality* is what `fs.readFileSync()` does for you. And that it would not be surprising if it failed too. But apparently that's not the case. 

I *briefly* took a look at the Node.js source trying to find `fs.readFileSync()` and `fs.readSync()` just to see what was going on. But I couldn't locate those functions.

