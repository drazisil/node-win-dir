const fs = require('fs');
const path = require("path")

function execute(args) {
    console.dir(args)

    if (args.targets !== undefined) {
        if (args.targets.length < 1) {
            console.log("Usage: " + __filename + " path/to/directory");
            process.exit(-1);
        }

        const dirPath = args.targets[0];
        const results = readDir(dirPath, args.options)
        console.log(results)
    }
}

function readDir(dirPath, options) {

    let listing = []

    const items = fs.readdirSync(dirPath)

    for (let i=0; i<items.length; i++) {

        const fullPath = path.join(dirPath,items[i]);

        // Is this a directory?
        const itemStats = fs.statSync(fullPath)

        if (itemStats.isDirectory()) {
            // This is a directory

            if (shouldSearchSubdirectories(options)) {
                if (!excludeDirectoryNames(options)) {
                    listing.push(fullPath)
                }

                const subItems = readDir(fullPath, options)
                listing = listing.concat(subItems)
            } else {
                listing.push(fullPath);
            }

        } else {
            // This is a file
            listing.push(fullPath)
        }
    }
    return listing;
}

function shouldSearchSubdirectories(options) {
    return options.subdirectories
}

function excludeDirectoryNames(options) {
    if (options.fileAttributes) {
        return options.fileAttributes.toLowerCase().indexOf("not-dir") !== -1
    }
    return false
}

module.exports = {
    execute,
    readDir
}
