const fs = require('fs');
const os = require('os');
const path = require('path');

const APP_DIRS = {
  darwin: {
    user: path.join(os.homedir(), 'Applications'),
    system: path.join('/', 'Applications'),
  },
  win32: {
    user: null,
    system: [
      // TODO: verify on win32 systems
      process.env.ProgramFiles,
      process.env['ProgramFiles(x86)'],
    ],
  },
  linux: {
    user: path.join('/', 'usr', 'share'),
    system: path.join('/', 'usr', 'share'),
  },
};

/**
 * Retrieves all apps in the given directory/directories
 *
 * @param {String|String[]} dirOrDirs - A directory or a list of directories to read
 * @return {Promise<string>} - Array of app paths
 */
exports.getAppsInDirectories = dirOrDirs => new Promise((resolve) => {
  const results = [];
  let dirsToRead = [];
  if (typeof dirOrDirs === 'string') {
    dirsToRead.push(dirOrDirs);
  } else {
    dirsToRead = dirOrDirs;
  }
  // read all directories (collect all promises)
  dirsToRead.forEach((dir) => {
    results.push(exports.getAppsInDirectory(dir));
  });
  Promise.all(results)
    .then((dirResults) => {
      const flatResults = dirResults.reduce((a, b) => a.concat(b), []);
      resolve(flatResults);
    });
});

/**
 * Retrieves all apps in the given directory
 *
 * @param {String} dir - A directory to read
 * @return {Promise<string>} - Array of app paths
 */
exports.getAppsInDirectory = dir => new Promise((resolve) => {
  const results = [];
  exports.readdir(dir).then((files) => {
    files.forEach((file) => {
      results.push(file);
    });
    resolve(results);
  });
});

/**
 * Reads the directory recursively to the specified level
 *
 * @param {String} dir
 * @return {Promise<String[]>}
 */
exports.readdir = dir => new Promise((resolve) => {
  const results = [];
  fs.readdir(dir, (err, files) => {
    if (!err) {
      files.forEach((file) => {
        // set a flag to determine skipping a file
        let skipFile = false;
        // darwin systems should only return .app extensions
        if (process.platform === 'darwin') {
          if (path.extname(file) !== '.app') {
            skipFile = true;
          }
        }
        if (!skipFile) {
          results.push(path.join(dir, file));
        }
      });
    }
    resolve(results);
  });
});

/**
 * Retrieve all applications
 *
 * @param {String} - The use type
 * @return {Promise<string>} - An array of app paths
 */
exports.getAll = (useType = 'system') => exports.getAppsInDirectories(APP_DIRS[process.platform][useType]);
