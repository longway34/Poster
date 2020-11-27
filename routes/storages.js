var express = require('express');
var router = express.Router();
// var bodyParser = require('body-parser');
const { getMaxListeners } = require('process');
// const { getFirmLogoBin } = require('../public/javascripts/DB');
// const PosterDB = require('../../PosterDB');

// router.use(bodyParser.json());


/* GET home page. */
router.get('/', async (req, res, next) => {
	console.debug('Get storages...');
	let PosterDB = require('../public/javascripts/DB');

	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let result = await PosterDB.getStorages(storage);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);
	console.debug('Send storages... Ok...');

	PosterDB.releace();
})

router.get('/test', async (req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	console.time("storagePosterSupplySyncronize");
	let storage_id = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let result = await PosterDB.getDataForStorageDefaultOrders();
	console.timeEnd("storagePosterSupplySyncronize");

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(result);

	PosterDB.releace();
})

router.post('/update_ingredients', async (req, res, next) =>{
	let PosterDB = require('../public/javascripts/DB');

	let data = {}
	try {
		data = JSON.parse(JSON.stringify(req.body));
	} catch(err){
		try{
			data = JSON.parse(req.body);
		} catch (err) {
			try{
				data = JSON.parse(Object.keys(req.body)[0]);
			} catch(err){
				data - JSON.parse(Object.values(req.body)[0]);
			}
		}
	}

	let result = await PosterDB.storage_update_ingredients(data);

	res.status(200).type('json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.json(result);

	PosterDB.releace();
})

const getUnit = (struct)=>{
	switch(struct.unit){
		case "kg": return {unit: "кг.", fixed: 3};
		case "p": return {unit: "шт.", fixed: 0};
		case "l": return {unit: "л.", fixed: 3};
		default: return { unit: "шт.", fixed: 0 };
	}
}

const getIngredientsFromStruct = (struct, ret={}) => {
	let res = {};

	let childs = struct.childs ? struct.childs : struct; 
	for (let key in childs) {
		let nextStruct;	let res;
		try{
			nextStruct = childs[key];
			ret = Object.assign({}, ret, getIngredientsFromStruct(nextStruct, ret));
		} catch {
			try{
				const nextStruct = childs[parseInt(key)];
				ret = Object.assign({}, ret, getIngredientsFromStruct(nextStruct, ret));
			} catch {
				console.log(`Unit ${struct} not is own struct`);
				return ret;
			}
		}
		// ret = Object.assign({}, ret, res);

	}
	if(!struct.type){
		console.log(`Unit ${struct} not is own struct`);
		return ret;
	}
	if (['product', 'ingredient'].indexOf(struct.type) < 0) {
		console.log(`Unit ${struct.type}:${struct.name} not is Product`);
		return ret;
	}

	let usage = parseInt(struct.usage);
	if (usage === 0) {
		console.log(`Unit ${struct.type}:${struct.name} not is Usage`);
		return ret;
	}

	let supplier = parseInt(struct.supplier);
	if (supplier < 0) {
		console.log(`Unit ${struct.type}:${struct.name} not state supplier`);
		return ret;
	}
	let amount = parseFloat(struct.amount);
	if (amount < 1e-5) {
		let max_left = parseFloat(struct.max_left);
		let min_left = parseFloat(struct.min_left);
		let min = max_left > 1e-5 ? max_left : min_left > 1e-5 ? min_left : -1;
		if (min < 0) {
			console.log(`Unit ${struct.type}:${struct.name} (amount:${struct.amount}; max_left:${struct.max_left}) not state max_left`);
			return ret;
		}
		let leftover = parseFloat(struct.leftover);
		amount = min - leftover;
		if (amount < 0) {
			console.log(`Unit ${struct.type}:${struct.name} leftover:${struct.leftover}; min/max:${struct.min_left}${struct.max_left} < leftover`);
			return ret;
		}
	}
	let cost = parseFloat(struct.cost);
	if (Object.keys(ret).indexOf(String(supplier))<0) {
		ret[supplier] = { ingredients: {} }
	} else {
		console.log("addading supplier...");
	}
	if (!ret[supplier].ingredients) {
		ret.supplier.ingredients = {} 
	} else {
		console.log('addading ingredient...');
	}
	console.log(`${struct.type} => ${struct.type}:${struct.name} is Ok...`);

	ret[supplier].ingredients[struct.id] = {
//		num: Object.keys(ret[supplier].ingredients).length.toFixed(0),
		name: struct.name,
		unit: getUnit(struct).unit,
		amount: amount.toFixed(getUnit(struct).fixed),
		cost: cost < 0 ? 0 : cost,
		summ: cost < 0 ? 0 : (cost * amount)
	}

	return ret;
}	

const getStorageOrdersData = async (storage, supplier, leftovers=null) => {
	let PosterDB = require('../public/javascripts/DB');

	ProductsAndIngredients = await PosterDB.getMenu(storage);
	leftovers = leftovers ? leftovers : await PosterDB.getLeftovers(ProductsAndIngredients, storage);

	let suppliers = await PosterDB.getSuppliers(supplier);
	let data = { storages: {} }
	for (let stKey of Object.keys(leftovers)) {

		let storage = leftovers[stKey];
		let ingredients = getIngredientsFromStruct(storage.leftovers);

		let st_index = parseInt(storage.id);
		data.storages[st_index] = storage;

		if (Object.keys(ingredients).length > 0) {
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
					data.storages[st_index].suppliers = data.storages[st_index].suppliers ? data.storages[st_index].suppliers : {};
					data.storages[st_index].suppliers[sup_index] = supplier;
					data.storages[st_index].suppliers[sup_index].ingredients = ingredients[parseInt(supplier.id)].ingredients;
					data.storages[st_index].suppliers[sup_index].number = num_order;
				}
			}
			// data[storage.id][ingredients] = Object.assign({}, ingredients)
		}
		PosterDB.releace();
	}
	return data;

}
const getStorageOrdersHtmlMessages = async(storage, supplier, data=null) => {
	let PosterDB = require('../public/javascripts/DB');
		const pug = require('pug');

		data = data ? data : await getStorageOrdersData(storage, supplier, data);
		const pugFunc = pug.compileFile('./views/storage_orders.pug');

	let image = await PosterDB.getFirmLogoBin();
		if (image && image.length < 4096) {
			data = Object.assign(data, { image: image })
		}

		const result = pugFunc(data);
		return result;

}



router.get('/docsMailHtml', async (req, res, next) =>{
	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;

	let data = await getStorageOrdersHtmlMessages(storage, supplier);

	const Email = require('email-templates');

	// const email = new Email({
	// 	message: {
	// 		from: 'longway34@gmail.com'
	// 	},
	// 	transport: {
	// 		jsonTransport: true
	// 	}
	// })

	// email
	// 	.send({
	// 		template: 'mars',
	// 		message: {
	// 			to: 'longway34@gmail.com'
	// 		},
	// 		locals: {
	// 			name: 'Alexander'
	// 		}
	// })
	// .then((response) =>{
		const nodemailer = require('nodemailer');

		let transporter = nodemailer.createTransport({
			// host: "smtp.mailtrap.io",
			// port: 2525,
			// auth: {
			// 	user: "2c393ff3d675de",
			// 	pass: "7879f9c8022f8e"
			// }
			host: 'longway34.fvds.ru',
			port: 25,
			secure: false,
			ignoreTLS: true,
			// opportunisticTLS,
			// tls: {
			// 	rejectUnauthorized: true
			// },
			// auth: {
			// 	user: 'longway',
			// 	pass: 'qwerty.123'
			// }
		});
		let mailOptions = {
			from: 'longway@longway34.fvds.ru',
			to: 'longway34@gmail.com',
			subject: 'Teste Templete ✔',
			html: data
		};
		transporter.sendMail(mailOptions, (error, info)=>{
			if(error){
				res.send(`<p>Error: ${error}`);
				return;
			}
			res.send(`<p>Message ${info.message} send ${info.response}</p>`);
		})


})

router.get('/ordersSend', async(req, res, next) =>{
	let storage_id = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier_id = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;

	try{
		let PosterDB = require('../public/javascripts/DB');
		let suppliersRows = await PosterDB.SyncSelectQuery('select * from suppliers where id=?', [supplier_id]);
		if(suppliersRows.length <= 0){
			res.status(400).type('json').send({err: -1, error:`Unknown supplier with id ${supplier_id}...`});
			return;
		}
		let storagesRows = await PosterDB.SyncSelectQuery('select * from storages where id=?', [storage_id]);
		if (storagesRows.length <= 0) {
			res.status(400).type('json').send({ err: -1, error: `Unknown storage with id ${storage_id}...` });
			return;
		}
		let firmInfo = await PosterDB.getFirmInfo();

		const storage = storagesRows[0];
		const supplier = suppliersRows[0];

		const method = parseInt(supplier.type_delivery_info);
		const address = supplier.address_delivery_info;
		let data = await getStorageOrdersData(storage, supplier);
		let transporter, toSendData, mailOptions, nodemailer;

		if([0, 1].indexOf(method) >=0){
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
		switch(method){
			case 0:{ // email html
				toSendData = await getStorageOrdersHtmlMessages(storage, supplier, data);
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
				let exFiles = await PosterDB.makeStorageOrdersExcel(data, image);
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
						let err = {result: -1, error: error};
						res.status(400).type('json').send(err);
						return error;
					}
					let message = { result: 0, message: `<p>Message ${info.message} send ${info.response}</p>`};
					res.status(200).type('json').send(message);
					return message;
				})
			}
			break;
			case 2:{
				let error = { result: -1, error: '<p>Error. Viber not supported now... Repeat send latter...'};
				res.status(400).type('json').send(error);
				return error;
			}
			break;
		}

	} catch(err){
		res.status(400).type('json').send({err: 0, error: err});
	}
});


router.get('/ordersSendExcel', async (req, res, next) => {
	let PosterDB = require('../public/javascripts/DB');

	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;


	let data = await getStorageOrdersData(storage, supplier);

	let image = await PosterDB.getFirmLogoBin();
	let exFiles = await PosterDB.makeStorageOrdersExcel(data, image);

	const nodemailer = require('nodemailer');

	let transporter = nodemailer.createTransport({
		// host: "smtp.mailtrap.io",
		// port: 2525,
		// auth: {
		// 	user: "2c393ff3d675de",
		// 	pass: "7879f9c8022f8e"
		// }
		host: "longway34.fvds.ru",
		port: 25,
		secure: false,
		ignoreTLS: true,
		// auth: {
		// 	user: "2c393ff3d675de",
		// 	pass: "7879f9c8022f8e"
		// }
	});
	let attach = [];
	for(nameStr of exFiles){
		attach.push({
			filename: nameStr.name,
			filePath: nameStr.path,
			path: nameStr.path,
			// file: `${nameStr.path}`,
			contentType: 'application/vnd.ms-excel',
		})
	}
	let mailOptions = {
		from: 'longway@longway34.fvds.ru',
		to: 'longway34@gmail.com',
		subject: 'Teste Templete ✔',
		html: '<p>Посмотрите файлы вложений...</p>',
		attachments: attach
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(`<p>Error: ${error}`, error);
			return error;
		}
		res.send(`<p>Message ${info.message} send ${info.response}</p>`);
	})
	// if(data.storages){
		res.send(data);
	// } else {
		// res.send('<p>Нет готовых к отправке заявок<p>')
	// }
});

router.get('/docs', async (req, res, next) => {
//	let PosterDB = require('../public/javascripts/DB');
	let storage = req.query.storage_id ? parseInt(req.query.storage_id) : -1;
	let supplier = req.query.supplier_id ? parseInt(req.query.supplier_id) : -1;
	console.log(`comm docs request with storage=${storage}, supplier=${supplier}...`);

	let data = await getStorageOrdersHtmlMessages(storage, supplier);
	console.log("comm docs request complite with storage=${storage}, supplier=${supplier}...")

//	let image = await getFirmLogoBin();

	res.send(data);

});

module.exports = router;
