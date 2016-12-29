console.time('getAll');

const osApps = require('./');

osApps.getAll().then(apps => {
  console.timeEnd('getAll');
})
