const osApps = require('./');

console.time('getAll');

osApps.getAll().then(apps => {
  console.timeEnd('getAll');
})
