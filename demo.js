const osApps = require('./');

osApps.getAll().then(apps => {
	apps.forEach(app => {
		console.log(app);
	});
})
