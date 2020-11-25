var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	ProductsAndIngredients = await PosterDB.getMenu(storage);
	let leftovers = await PosterDB.getLeftovers(ProductsAndIngredients, storage);

	// var fs = require('fs');
	// fs.writeFileSync("data.json", JSON.stringify(leftovers));

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(leftovers);
});


module.exports = router;
