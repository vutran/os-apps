const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Retrieves all apps in the given directory/directories
 *
 * @param {String[]} dirs - A list of directories to read
 * @return {Promise<string>} - Array of app paths
 */
exports.getAppsInDirectories = dirs => new Promise((resolve) => {
  const results = [];
  // read all directories (collect all promises)
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    results.push(exports.getAppsInDirectory(dir));
  }
  Promise.all(results)
    .then((dirResults) => {
      const flatResults = [];
      for (let i = 0; i < dirResults.length; i++) {
        const dirFiles = dirResults[i];
        if (dirFiles.length) {
          for (let j = 0; j < dirFiles.length; j++) {
            flatResults.push(dirFiles[j]);
          }
        }
      }
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
  fs.readdir(dir, (err, files) => {
    if (!err) {
      for (let i = 0; i< files.length; i++) {
        const file = files[i];
        // set a flag to determine skipping a file
        let skipFile = false;
        if (process.platform === 'darwin' && path.extname(file) !== '.app') {
          // darwin systems should only return .app extensions
          skipFile = true;
        } else if (process.platform === 'linux' && path.extname(file) !== '.desktop') {
          // linux systems should only return .desktop extensions
          skipFile = true;
        }
        if (!skipFile) {
          results.push(path.join(dir, file));
        }
      }
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
exports.getAll = (useType = 'system') => {
  let dirs = { user: '', system: '' };
  switch (process.platform) {
    case 'darwin':
      dirs = {
        user: path.join(os.homedir(), 'Applications'),
        system: [
          path.join('/', 'Applications'),
        ],
      };
      break;
    case 'win32':
      dirs = {
        user: null,
        system: [
          process.env.ProgramFiles,
          process.env['ProgramFiles(x86)'],
        ],
      };
      break;
    case 'linux':
      const usrSharePath = path.join('/', 'usr', 'share', 'applications');
      dirs = {
        user: usrSharePath,
        system: [
          usrSharePath,
        ],
      };
      break;
  }
  return exports.getAppsInDirectories(dirs[useType]);
};
