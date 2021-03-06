const fs = require('fs');
const glob = require("glob")
const path = require("path")

function execute(args) {
    console.dir(args)

    if (args.targets !== undefined) {
        if (args.targets.length < 1) {
            console.log("Usage: " + __filename + " path/to/directory");
            process.exit(-1);
        }

        const { options } = args

        const dirPath = args.targets[0];
        const results = readDir(dirPath, options)

        if (_shouldExcludeGlob(options)) {
            return _filterExcludeGlob(results, options)
        }

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

            if (_shouldSearchSubdirectories(options)) {
                if (!_excludeDirectoryNames(options)) {
                    listing.push(fullPath)
                }

                const subItems = readDir(fullPath, options)
                listing = listing.concat(subItems)
            } else {
                if (!_excludeDirectoryNames(options)) {
                    listing.push(fullPath)
                }
            }

        } else {
            // This is a file
            listing.push(fullPath)
        }
    }

    return listing;
}

function _shouldSearchSubdirectories(options) {
    return options.subdirectories || false;
}

function _excludeDirectoryNames(options) {
    return options.hideDirectories || false;
}

function _shouldExcludeGlob(options) {
    return (options.excludeGlobs && options.excludeGlobs !== 'true')  || false;
}

function _filterExcludeGlob(files, options) {

    const globs = options.excludeGlobs.split(",")

    let filteredFiles = files

    console.log(globs)

    for (const globsKey in globs) {
        console.log(globsKey)
        console.log(filteredFiles)

        const filesToExclude = glob.sync(globsKey, {})
        filteredFiles = filteredFiles.filter((file) => {
            return !filesToExclude.includes(file)
        })
    }

    return filteredFiles
}

module.exports = {
    execute,
    readDir,
    _shouldSearchSubdirectories,
    _excludeDirectoryNames,
    _shouldExcludeGlob,
    _filterExcludeGlob
}
