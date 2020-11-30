var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
	console.log('Get settings...');
	console.log("__dirname"+__dirname);
	let PosterDB = require('../public/javascripts/DB');

	const firmInfo = await PosterDB.getInitInfo();
	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');

	res.send(firmInfo);
	PosterDB.releace();
	console.log('send settings... Ok...');
})

module.exports = router;
