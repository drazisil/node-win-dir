const fs = require('fs');
const path = require("path")

function execute(args) {
    console.dir(args)

    if (args.targets !== undefined) {
        if (args.targets.length < 1) {
            console.log("Usage: " + __filename + " path/to/directory");
            process.exit(-1);
        }

        // Was the /s flag provided?
        const shouldSearchSubdirectories = args.options.subdirectories | false

        const dirPath = args.targets[0];
        readDir(dirPath, shouldSearchSubdirectories)
    }
}

function readDir(dirPath, shouldSearchSubdirectories) {

    const items = fs.readdirSync(dirPath)

        for (let i=0; i<items.length; i++) {

            const fullPath = path.join(dirPath,items[i]);

            // Is this a directory?
            const itemStats = fs.statSync(fullPath)

            if (itemStats.isDirectory()) {
                // This is a directory


                if (shouldSearchSubdirectories) {
                    console.log("Directory!")
                    const subItems = readDir(fullPath, shouldSearchSubdirectories)
                }

            }

            console.log(fullPath);
        }
}

module.exports = {
    execute,
    readDir
}
