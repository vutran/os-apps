const fs = require('fs');
const os = require('os');
const path = require('path');

const APP_DIRS = {
  darwin: {
    user: path.join(os.homedir(), 'Applications'),
    system: path.join('/', 'Applications'),
  },
  win32: {
    // TODO
  },
  linux: {
    // TODO
  },
};

/**
 * Retrieves all apps in the given directory
 *
 * @param {String} dir - The directory to read
 * @return {Promise<string>} - Array of app paths
 */
exports.getAppsInDirectory = dir => new Promise((resolve) => {
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
exports.getAll = (useType = 'system') => exports.getAppsInDirectory(APP_DIRS[process.platform][useType]);
