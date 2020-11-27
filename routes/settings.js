var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
	console.debug('Get settings...');
	let PosterDB = require('../public/javascripts/DB');

	const firmInfo = await PosterDB.getInitInfo();
	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');

	res.send(firmInfo);
	PosterDB.releace();
	console.debug('send settings... Ok...');
})

module.exports = router;
