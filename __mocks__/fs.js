const fs = jest.genMockFromModule('fs');

let mockDirectoryFiles = [];
let mockIsInvalidDirectory = false;

/**
 * Sets the directore's files.
 *
 * @param {String[]} contents
 */
// eslint-disable-next-line no-underscore-dangle
fs.__setDirectoryFiles = (contents) => {
  mockDirectoryFiles = contents;
};

/**
 * Sets the invalid directory flag
 *
 * @param {Boolean} flag
 */
// eslint-disable-next-line no-underscore-dangle
fs.__setIsInvalidDirectory = (flag) => {
  mockIsInvalidDirectory = flag;
};

/**
 * Reads the directory
 *
 * @param {String}
 * @param {Function} callback
 */
fs.readdir = (file, callback) => {
  if (mockIsInvalidDirectory) {
    callback.call(null, true);
  } else {
    callback.call(null, null, mockDirectoryFiles);
  }
};

module.exports = fs;
