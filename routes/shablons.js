// import { getIngredientsFromStruct, getUnit} from './constants'

const constants = require('./constants');
// const getUnit = require('./constants');

var express = require('express');
var router = express.Router();
//var bodyParser = require('body-parser')

//router.use(bodyParser.json());

const getShablonOrdersData = async (storage, shablon, supplier, leftovers=null) => {
	let PosterDB = require('../public/javascripts/DB');

	ProductsAndIngredients = await PosterDB.getMenu(storage);
	leftovers = leftovers ? leftovers : await PosterDB.getLeftoversShablon(shablon, ProductsAndIngredients, storage);

	let suppliers = await PosterDB.getSuppliers(supplier);
	let data = { storages: {} }
	for (let stKey of Object.keys(leftovers)) {

		let storage = leftovers[stKey];

		for (let [sh_index, shablon] of storage.shablons ? Object.entries(storage.shablons) : Object.entries({})){

			let ingredients = constants.getIngredientsFromStruct(shablon.leftovers);

			if (Object.keys(ingredients).length > 0) {
				let st_index = parseInt(storage.id);
				data.storages[st_index] = storage;
				for (let supplier of Object.values(suppliers)) {
					let sup_index = parseInt(supplier.id);
					if (ingredients[sup_index]) {
						if (!data.firm) {
							data.firm = await PosterDB.getFirmInfo();
						}

						let num_order = 1;
						let res_num = await PosterDB.SyncSelectQuery(
							'Select * from for_orders where suid=? and sid=?',
							[parseInt(supplier.id), parseInt(storage.id)]
						)
						if (res_num.length > 0) {
							num_order = parseInt(res_num[0].num) + 1;
						}
						data.storages[st_index].shablons = data.storages[st_index].shablons ? data.storages[st_index].shablons : {};
						data.storages[st_index].shablons[sh_index] = data.storages[st_index].shablons[sh_index] ? data.storages[st_index].shablons[sh_index] : shablon;
						data.storages[st_index].shablons[sh_index].suppliers = data.storages[st_index].shablons[sh_index].suppliers ? data.storages[st_index].shablons[sh_index].suppliers : {};
						data.storages[st_index].shablons[sh_index].suppliers[sup_index] = data.storages[st_index].shablons[sh_index].suppliers[sup_index] ? data.storages[st_index].shablons[sh_index].suppliers[sup_index] : supplier;
						data.storages[st_index].shablons[sh_index].suppliers[sup_index].ingredients = ingredients[parseInt(supplier.id)].ingredients;
						data.storages[st_index].shablons[sh_index].suppliers[sup_index].number = num_order;
					}
				}
				// data[storage.id][ingredients] = Object.assign({}, ingredients)
			}
		}
		PosterDB.releace();
	}
	return data;

}



router.get("/", async(req, res, next) =>{
	let PosterDB = require('../public/javascripts/DB');

	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let result = await PosterDB.getShablons(storage);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);

})

router.post('/update_ingredients', async (req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	let data = {}
	try {
		data = JSON.parse(JSON.stringify(req.body));
	} catch (err) {
		try {
			data = JSON.parse(req.body);
		} catch (err) {
			try {
				data = JSON.parse(Object.keys(req.body)[0]);
			} catch (err) {
				data - JSON.parse(Object.values(req.body)[0]);
			}
		}
	}

	let result = await PosterDB.shablon_update_ingredients(data);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.json(result);

	PosterDB.releace();
})

router.get("/leftovers", async (req, res, next) =>{
	let PosterDB = require('../public/javascripts/DB');

	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let shablon = req.query.shablon_id ? parseInt(req.query.shablon_id) : -1;
	ProductsAndIngredients = await PosterDB.getMenu(storage);
	let leftovers = await PosterDB.getLeftoversShablon(shablon, ProductsAndIngredients, storage);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(leftovers);
})

router.get("/delete", async(req, res, next) =>{
	let PosterDB = require('../public/javascripts/DB');

	let shablon_id = req.query.id ? parseInt(req.query.id) : -1;
	let storage_id = req.query.storage_id ? parseInt(req.query.storage_id) : -1;

	let result = await PosterDB.deleteShablon(storage_id, shablon_id);
	
	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);
})

router.post("/update", async(req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	let data;
	try{
		data = JSON.parse(JSON.stringify(req.body));
	} catch (err){
		try {
			data = JSON.parse(req.body);
		} catch (err) {
			data = JSON.parse(Object.keys(req.body)[0]);
		}
	}

	let result = await PosterDB.modifyShablon(data);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);
	
})

const getShablonOrdersHtmlMessages = async (storage, shablon, supplier, data = null) => {
	let PosterDB = require('../public/javascripts/DB');
	const pug = require('pug');

	const pugFunc = pug.compileFile('./views/shablon_orders.pug');
	data = data ? data : await getShablonOrdersData(storage, shablon, supplier, data);

	let image = await PosterDB.getFirmLogoBin();
	if (image && image.length < 4096) {
		data = Object.assign(data, { image: image })
	}

	const result = pugFunc(data);
	return result;

}

router.get('/docs', async (req, res, next) => {
	//	let PosterDB = require('../public/javascripts/DB');
	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;
	let shablon = req.query.shablon_id ? parseInt(req.query.shablon_id) : -1;
	console.log(`comm docs request with storage=${storage}, supplier=${supplier}, shablon=${shablon}...`);

	let data = await getShablonOrdersHtmlMessages(storage, shablon, supplier);
	// console.log(`comm docs request complite with storage=${storage}, supplier=${supplier}...`,data)

	//	let image = await getFirmLogoBin();

	res.send(data);

});

// const getShablonOrdersHtmlMessages = async (storage, supplier, data = null) => {
// 	let PosterDB = require('../public/javascripts/DB');
// 	const pug = require('pug');

// 	data = data ? data : await getShablonOrdersData(storage, supplier, data);
// 	const pugFunc = pug.compileFile('./views/storage_orders.pug');

// 	let image = await PosterDB.getFirmLogoBin();
// 	if (image && image.length < 4096) {
// 		data = Object.assign(data, { image: image })
// 	}

// 	const result = pugFunc(data);
// 	return result;

// }

router.get('/ordersSend', async (req, res, next) => {
	let storage_id = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier_id = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;
	let shablon_id = req.query.shablon_id ? parseInt(req.query.shablon_id) : -1;

	try {
		let PosterDB = require('../public/javascripts/DB');
		let suppliersRows = await PosterDB.SyncSelectQuery('select * from suppliers where id=?', [supplier_id]);
		if (suppliersRows.length <= 0) {
			res.status(400).type('json').send({ result: -1, error: `Unknown supplier with id ${supplier_id}...` });
			return;
		}
		let storagesRows = await PosterDB.SyncSelectQuery('select * from storages where id=?', [storage_id]);
		if (storagesRows.length <= 0) {
			res.status(400).type('json').send({ result: -1, error: `Unknown storage with id ${storage_id}...` });
			return;
		}
		let shablonsRows = await PosterDB.SyncSelectQuery('select * from shablons where id=?', [shablon_id]);
		if (shablonsRows.length <= 0) {
			res.status(400).type('json').send({ result: -1, error: `Unknown shablon with id ${shablon_id}...` });
			return;
		}
		let firmInfo = await PosterDB.getFirmInfo();

		const storage = storagesRows[0];
		const supplier = suppliersRows[0];
		const shablon = shablonsRows[0];

		const method = parseInt(supplier.type_delivery_info);
		const address = supplier.address_delivery_info;
		let data = await getShablonOrdersData(storage, shablon, supplier);
		let transporter, toSendData, mailOptions, nodemailer;

		if ([0, 1].indexOf(method) >= 0) {
			nodemailer = require('nodemailer');
			transporter = nodemailer.createTransport({
				host: 'longway34.fvds.ru',
				port: 25,
				secure: false,
				ignoreTLS: true,
			});
			mailOptions = {
				from: 'longway@longway34.fvds.ru',
				to: `${address}`,
				subject: `Заказ от "${firmInfo.company_name}" ✔`,
			};
		}
		switch (method) {
			case 0: { // email html
				toSendData = await getShablonOrdersHtmlMessages(storage, shablon, supplier, data);
				mailOptions = Object.assign({}, mailOptions, {
					html: toSendData
				})
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						let err = { result: -1, error: error };
						res.status(400).type('json').send(err);
						return error;
					}
					let message = { result: 0, message: `<p>Message ${info.message} send ${info.response}</p>` };
					res.status(200).type('json').send(message);
					return message;
				})
			}
				break;
			case 1: { // email excel
				toSendData = 'Информация во вложенных файлах'
				let image = await PosterDB.getFirmLogoBin();
				let exFiles = await PosterDB.makeShablonOrdersExcel(data, image);
				let attach = [];
				for (nameStr of exFiles) {
					attach.push({
						filename: nameStr.name,
						filePath: nameStr.path,
						path: nameStr.path,
						contentType: 'application/vnd.ms-excel',
					})
				}
				mailOptions = Object.assign({}, mailOptions, {
					html: toSendData,
					attachments: attach

				})
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						let err = { result: -1, error: error };
						res.status(400).type('json').send(err);
						return error;
					}
					let message = { result: 0, message: `<p>Message ${info.message} send ${info.response}</p>` };
					res.status(200).type('json').send(message);
					return message;
				})
			}
				break;
			case 2: {
				let error = { result: -1, error: '<p>Error. Viber not supported now... Repeat send latter...' };
				res.status(400).send(error);
				return error;
			}
				break;
		}

	} catch (err) {
		res.status(400).send({ err: 0, error: err });
	}
});

module.exports = router;
