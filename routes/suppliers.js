var express = require('express');
var router = express.Router();
// var bodyParser = require('body-parser')

// router.use(bodyParser.json());
/* GET home page. */
router.get('/', async (req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	let supplier = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;
	let result = await PosterDB.getSuppliers(supplier);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);
})

//router.post('/update', express.json({ type: '*/*' }), async (req, res, next) => {
router.post('/update', async (req, res, next) =>{
	console.log('update sullpier...');
	let data = {};
	try{
		data=JSON.parse(req.body);
	} catch(err){
		data = JSON.parse(Object.keys(req.body)[0]);
	}
	let PosterDB = require('../public/javascripts/DB');

	result = await PosterDB.updateSupplier(data);
	console.log("data: ", result);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);

})

module.exports = router;
