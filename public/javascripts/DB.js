const axios = require('axios');
const mysql = require('mysql2');
const Path = require('path');
const fs = require('fs');
const { count } = require('console');
const { response } = require('express');
var child_process = require('child_process');

const connectProperty = {
	host: "localhost",
	user: "root",
	database: "poster-pkl",
	password: "qwerty",
	multipleStatements: true
}

const conTestProperty = {
	host: 'localhost',
	user: 'root',
	password: 'qwerty',
	database: 'mysql'
}

const PosterConnectProperties = {
	host: "https://joinposter.com/api/",
	token: '914032:8162950c303fcdb947bcb09688b7c3dd'
}

class PosterDB {
	async initConnect(){
		let tConn = mysql.createConnection(conTestProperty);
		let res = await this.SyncSelectQuery("show databases like 'poster-pkl'", [], tConn);
		tConn.end();
		let out, count=0;
		if(res.length <= 0){
			do{
				out = child_process.execSync('pwd');
				let fn = __dirname+'/poster-pkl-create.sql';
				// let execStr = `mysql --user=root --password=qwerty mysql < ${fn}`;
				let buff = fs.readFileSync(fn);
				let execStr = `mysql --user=root --password=qwerty mysql`;
				out = child_process.execSync(execStr,{input: buff});
				count++;
				if(!out.error) {
					console.log('DB create Ok...');
					this.conn = mysql.createPool(connectProperty);
					return;
				}
				console.log(out.stdout);
			} while(count <2)
		} else {
			this.conn = mysql.createPool(connectProperty);
			return;
		} 

		if(out){
			console.log('Error DB init...')
			return null;
		}
	}
	constructor(){
		this.initConnect();
		// console.log(this.conn);
	}
	connection(){
		return this.conn;
	}

	getKey = () => {
		return Math.round(Math.random() * 10000000);
	}

	SyncSelectQuery(query, args, conn=null){
		if(!conn){
			conn=this.conn;
		}
		try{
			return new Promise((resolve, reject)=>{
				conn.query(query, args, (err, result) => {
					if (err) {
						console.log(err);
						reject(err);
						return err;
					}
					// console.log("SQL OK...", result);
					resolve(result);
					return result;
				});
			})
		}catch(err){
			return err;
		}
	}

	releace(){
		// this.conn.end();
	}

	async ingredientsSynchronize(posterRows, type = "products", leftovers=null) {
		let isComplite;

		do{
			isComplite = true;
			let sqlRows = await this.SyncSelectQuery("select * from ingredients", []);

			let find = false;
			for (let i in posterRows) {
				let posterRow = posterRows[i];
				if (type === "products" && posterRow.type !== "3") {
					continue;
				}

				let id = parseInt(posterRow.ingredient_id); find = false;
				for (let si in sqlRows) {
					let sqlRow = sqlRows[si]; let sql_poster_id = sqlRow.poster_id;
					if (id === sql_poster_id) {
						posterRow.poster_id = id;
						posterRow.sql_id = sqlRow.id;
						if(leftovers){
							let left = this.getRowById_Array(leftovers, "ingredient_id", id);
							if(left){
								let oldLimit = parseFloat(sqlRow.poster_limit); let oldCost = parseFloat(sqlRow.poster_cost);
								let limit = parseFloat(left.limit_value); let cost = parseFloat(left.prime_cost);
								let uid = parseInt(sqlRow.id);
								if(Math.abs(oldLimit - limit) > 1e-3 || Math.abs(oldCost - cost) > 1e-3){
									let params = [limit, cost, uid];

									// console.debug(`update limits in ${uid} product...`, params);

									let sql = "update ingredients set poster_limit=?, poster_cost=? where id=?";

									let res = await this.SyncSelectQuery(sql, params);
									isComplite = false;
								}
							}
						}

						find = true;
						break;
					}
				}
				if (!find) {
					let sqlResult = await this.SyncSelectQuery("insert into ingredients (poster_id) values (?)", [id]);
					isComplite = false;
				}
			}
		} while(!isComplite)
		return JSON.parse(JSON.stringify(posterRows));
	}

	async storageSynchronize(posterStorageRows) {
		if(!posterStorageRows){
			posterStorageRows = {};
		}
		if(posterStorageRows.storage_id){
			posterStorageRows = [posterStorageRows];
		}
		if (Array.isArray(posterStorageRows)) {
			posterStorageRows = Object.assign({}, posterStorageRows);
		}

		let isComplite = true;
		do{
			isComplite = true;
			let sqlStorageRows = await this.SyncSelectQuery("select * from storages", []);
			if (Array.isArray(sqlStorageRows)) {
				sqlStorageRows = Object.assign({}, sqlStorageRows);
			}

			for (let s in posterStorageRows) {
				let posterStorage = posterStorageRows[s]; let id = parseInt(posterStorage.storage_id);
				let find = false;
				for (let ss in sqlStorageRows) {
					find = false;
					let sqlStorage = sqlStorageRows[ss]; let sid = sqlStorage.poster_id;
					if (id === sid) {
						find = true;
						posterStorage.sql_id = sqlStorage.id;
						posterStorage.poster_id = id;
						// console.log(`Find storages with id=${id}...`);
						break;
					}
				}
				if (!find) {
					let sqlResult = await this.SyncSelectQuery("insert into storages (poster_id) values (?)", [id]);
					isComplite = false;
					// console.log(`Add new storage with id=${id}...`);
				}
			}
		} while(!isComplite)

		return JSON.parse(JSON.stringify(posterStorageRows));
	}

	getRowById_Array(rows, name, id){
		let rs = Array.isArray(rows) ? Object.assign({}, rows) : rows;
			try { id = parseInt(id) } catch { id = id }
			const keys = Object.keys(rs);
			for (let i = 0; i < keys.length; i++) {
				let value = rs[keys[i]][name];
				try { value = parseInt(value) } catch { value = value }
				if (id === value) {
					return rs[i];
				}
			}
		return null;
	}

	async getMenu(storage=-1){
		const storage_id = typeof(storage) === 'object' ? parseInt(storage.poster_id) : parseInt(storage);
		const storageStr = storage_id < 1 ? "" : `&storage_id=${storage_id}`;
		const urlLeft = 
			`${PosterConnectProperties.host}storage.getStorageLeftovers?token=${PosterConnectProperties.token}${storageStr}&zero_leftovers=true`;
		// console.log('url', urlLeft);
		let responseLeft = await axios.get(urlLeft);
		let leftoversRows = Object.assign({}, responseLeft.data.response);

		const getProductStruct = (categories, currentIndex, struct = null, poster_products=null, leftovers=null)=>{
			let currentCategory = {};
			if(struct){
				let category = categories[currentIndex];
				currentCategory = { 
					id: this.getKey(),
					type: "productsCategory",
					poster_id: parseInt(category.category_id), 
					name: category.category_name,
					src: Object.assign({}, category),
					supplier: -1,
					usage: 0,
					childs: {}
				}
				struct.childs[currentCategory.id] = Object.assign({}, currentCategory);
			} else {
				struct = {id: 0, name: "root", poster_id: 0, childs: {}, supplier: -1, usage: 0}
				currentCategory = Object.assign({}, struct);
			}

			if (poster_products) {
				for (let p in poster_products) {
					let poster_product = poster_products[p];
					if (parseInt(poster_product.menu_category_id) == currentCategory.poster_id) {
						if(poster_product.type === "3"){
//							const pKey = this.getKey();
							const pKey = poster_product.sql_id;
							// let lefts = this.getRowById_Array(leftoversRows, "ingredient_id", poster_product.poster_id);
							let lefts = leftovers ? this.getRowById_Array(leftovers, "ingredient_id", poster_product.poster_id) : null;
							currentCategory.childs[pKey] = Object.assign({},{
								id: pKey, 
								sql_id: poster_product.sql_id,
								type: "product",
								poster_id: poster_product.poster_id, 
								name: poster_product.product_name,
								// left: lefts ? parseFloat(lefts.storage_ingredient_left) : 0.0, 
								limit: lefts ? parseFloat(lefts.limit_value) : poster_product.poster_limit ? poster_product.poster_limit : 0,
								cost: lefts ? parseFloat(lefts.prime_cost) : poster_product.poster_cost ? poster_product.poster_cost : 0,
								src: Object.assign({}, poster_product),
								childs: {} 
							})
						}
					}
				}
			}

			for(let i in categories){
				let row = categories[i];
				if(parseInt(row.parent_category) === currentCategory.poster_id){
					const nextCategory = getProductStruct(categories, i, currentCategory, poster_products, leftovers);
					if(nextCategory){
						currentCategory.childs[nextCategory.id] = JSON.parse(JSON.stringify(nextCategory));
					}
				}

			}
			return currentCategory;
		}

		let url = `${PosterConnectProperties.host}menu.getCategories?token=${PosterConnectProperties.token}`;
		// console.log('url', url);
		let response = await axios.get(url);
		let categories = Object.assign({}, response.data.response);

		url = `${PosterConnectProperties.host}menu.getProducts?token=${PosterConnectProperties.token}`;
		// console.log('url', url);
		response = await axios.get(url);
		let poster_products = Object.assign({}, response.data.response);

		// console.time("ingredientsSynchronize");
		let res = await this.ingredientsSynchronize(poster_products, "products", leftoversRows);
		// console.timeEnd("ingredientsSynchronize");

		let struct = getProductStruct(categories, 0, null, poster_products, leftoversRows);

		const getIngredientsStruct = (categories, struct) =>{
			for(let i in categories){
				let row = categories[i];
				const key = this.getKey();

				struct.childs[key] = JSON.parse(JSON.stringify(
					{
						id: key,
						type: "ingredientsCategory",
						poster_id: parseInt(row.category_id),
//						image: row.category_photo,
						name: row.name,
						src: Object.assign({}, row),
						supplier: -1,
						usage: 0,
						childs: {}
					}
				))
			}
			return JSON.parse(JSON.stringify(struct));
		}

		const addIngredients = (struct, ingredients, leftovers=null) =>{
			for(let i in ingredients){
				let row = ingredients[i];
				let lefts = leftovers ? this.getRowById_Array(leftovers, "ingredient_id", row.ingredient_id) : null;
				let ingredient = {
//					id: this.getKey(),
					id: row.sql_id,
					sql_id: row.sql_id,
					name: row.ingredient_name,
					type: "ingredient",
					poster_id: row.poster_id,
					src: Object.assign({}, row),
					childs: {},
					limit: lefts ? parseFloat(lefts.limit_value) : 0,
					cost: lefts ? parseFloat(lefts.prime_cost) : 0,
					usage: 0,
					supplier: -1
				}
				if(row.category_id === 0){
					struct.childs[ingredient.id] = JSON.parse(JSON.stringify(ingredient));
				} else {
					for(let c in struct.childs){
						let category = struct.childs[c];
						if (category.type === "ingredientsCategory"){
							if(category.poster_id == parseInt(row.category_id)){
								category.childs[ingredient.id] = JSON.parse(JSON.stringify(ingredient));
							}
						}
					}
				}
			}
			return JSON.parse(JSON.stringify(struct));
		}

		url = `${PosterConnectProperties.host}menu.getCategoriesIngredients?token=${PosterConnectProperties.token}`;
		// console.log('url', url);
		response = await axios.get(url);
		categories = Object.assign({}, response.data.response);

		url = `${PosterConnectProperties.host}menu.getIngredients?token=${PosterConnectProperties.token}`;
		// console.log('url', url);
		response = await axios.get(url);
		let ingredients = Object.assign({}, response.data.response);

		// console.time("ingredientsSynchronize");
		res = await this.ingredientsSynchronize(ingredients, "ingredients", leftoversRows);
		// console.timeEnd("ingredientsSynchronize");

		struct = getIngredientsStruct(categories, struct);
		struct = addIngredients(struct, ingredients, leftoversRows);

		// console.log(struct);
		return struct;
	}

	async supplierSynchronize(posterSupplierRows){
		if (Array.isArray(posterSupplierRows)) {
			posterSupplierRows = Object.assign({}, posterSupplierRows);
		}

		let isComplite = true;
		do {
			isComplite = true;
			let sqlSupplierRows = await this.SyncSelectQuery("select * from suppliers", []);
			if (Array.isArray(sqlSupplierRows)) {
				sqlSupplierRows = Object.assign({}, sqlSupplierRows);
			}

			for (let s in posterSupplierRows) {
				let posterSupplier = posterSupplierRows[s]; let id = parseInt(posterSupplier.supplier_id);
				let find = false;
				for (let ss in sqlSupplierRows) {
					find = false;
					let sqlSupplier = sqlSupplierRows[ss]; let sid = sqlSupplier.poster_id;
					if (id === sid) {
						find = true;
						posterSupplier.sql_id = sqlSupplier.id;
						posterSupplier.poster_id = id;
						posterSupplier.address_delivery_info = sqlSupplier.address_delivery_info;
						posterSupplier.type_delivery_info = sqlSupplier.type_delivery_info;

						// console.log(`Find supplier with id=${id}...`);
						break;
					}
				}
				if (!find) {
					let sqlResult = await this.SyncSelectQuery("insert into suppliers (poster_id) values (?)", [id]);
					isComplite = false;
					// console.log(`Add new supplier with id=${id}...`);
				}
			}
		} while (!isComplite)

		return JSON.parse(JSON.stringify(posterSupplierRows));
	}

	async getSuppliers(supplier=-1){
//		let supplier = supplier_id < 0 ? "" : `&supplier_id=${supplier_id}`;
		let poster_supplier_id = typeof(supplier) === 'object' ? parseInt(supplier.poster_id) : parseInt(supplier)
		let command = "storage.getSuppliers";
		let url = `${PosterConnectProperties.host}${command}?token=${PosterConnectProperties.token}`;
		let supplierRows = await axios.get(url);

		let response = await axios.get(url);
		supplierRows = response.data.response;
		
		// if(poster_supplier_id < 0){
		supplierRows = await this.supplierSynchronize(supplierRows);
		// }

		let struct = {};
		for(let k in supplierRows){
			let supplier = supplierRows[k];
			let poster_id = supplier.poster_id ? parseInt(supplier.poster_id) : supplier.supplier_id ? parse_int(supplier.supplier_id) : -1;
			if(poster_id === poster_supplier_id || poster_supplier_id < 0){
//				const key = this.getKey();
				const key = supplier.sql_id;
				struct[key] = {
					id: key,
					sql_id: supplier.sql_id,
					name: supplier.supplier_name,
					poster_id: supplier.poster_id,
					address: supplier.supplier_addres,
					type_delivery_info: supplier.type_delivery_info,
					address_delivery_info: supplier.address_delivery_info,
					src: Object.assign({}, supplier)
				}
			}
		}
		return JSON.parse(JSON.stringify(struct));
	}
	async getStorages(storage =-1){
		let poster_storage_id = typeof(storage) === 'object' ? parseInt(storage.poster_id) : parseInt(storage);
		let poster_storage =  poster_storage_id < 0 ? "" : `&storage_id=${poster_storage_id}`
		let command = poster_storage_id < 0 ? "storage.getStorages" : "storage.getStorage";
		let url = `${PosterConnectProperties.host}${command}?token=${PosterConnectProperties.token}${poster_storage}`;

		let response = await axios.get(url);
		let storageRows = response.data.response;

		let struct = {};
		storageRows = await this.storageSynchronize(storageRows);

		if (poster_storage_id < 0){
			await this.storagePosterSupplySyncronize();
		}

		for(let [k, row] of Object.entries(storageRows)){
//			let row = storageRows[k];
//			const stKey = this.getKey();
			const stKey = row.sql_id;
			const poster_id = parseInt(row.storage_id);
			struct[stKey] = {
				id: stKey,
				sql_id: row.sql_id,
				name: row["storage_name"],
				poster_id: row.poster_id,
				src: JSON.parse(JSON.stringify(row)),
			}
		}
		return JSON.parse(JSON.stringify(struct));
	}

	findUnitFromMenu(unit, struct){
		let findType = String(unit["ingredients_type"]) === "1" ? "ingredient" : "product";
		let rows = struct.childs ? struct.childs : struct;
		for (let k in rows) {
			let s = rows[k];
			if (s.type === findType) {
				if (s.poster_id === parseInt(unit["ingredient_id"])) {
					return s;
				}
			}
			let r = this.findUnitFromMenu(unit, s);
			if (r) {
				return r;
			}
		}
		return null;
	}
	
	getLeftoversShablon = async (shablon=-1, menuStruct = null, storage = -1) => {
		try{
			let shablon_id = typeof(shablon) === 'object' ? parseInt(shablon.id) : parseInt(shablon);
			let storage_id = typeof(storage) === 'object' ? parseInt(storage.poster_id) : parseInt(storage);

			let storages = await this.getStorages(storage_id);
			menuStruct = menuStruct ? menuStruct : await this.getMenu(storage_id);
			for(let [k, storage] of Object.entries(storages)){

				// let leftMenuStruct = storage.leftovers;

				let storage_id = `&storage_id=${storage.poster_id}`
				let url = `${PosterConnectProperties.host}storage.getStorageLeftovers?token=${PosterConnectProperties.token}&zero_leftovers=true${storage_id}`
				let response = await axios.get(url);
				let leftoverRows = response.data.response;

				let sh_url = 'select * from shablons where storage_id=?';
				let sh_par = [storage.id];
				if(shablon_id > 0){
					sh_url = sh_url + ' and id=?';
					sh_par.push(shablon_id);
				}
				let shablons = await this.SyncSelectQuery(sh_url, sh_par);
				for(let shablon_struct of shablons){
					if(!storage.shablons){
						storage.shablons = {};
					}
					storage.shablons[shablon_struct.id] = JSON.parse(JSON.stringify(shablon_struct));
					let shablon = storage.shablons[shablon_struct.id];
					shablon.leftovers = JSON.parse(JSON.stringify(menuStruct.childs));
					let leftMenuStruct = shablon.leftovers;

					let count = 0;
					for (let leftRow of leftoverRows) {
						let ingredient = this.findUnitFromMenu(leftRow, leftMenuStruct);
						if (ingredient) {
							const poster_ingredient_id = parseInt(leftRow.ingredient_id);
							const whereShid = ` and (shid=${shablon_id} || shid=-1) `
							let sqlQuery = `select * from for_shablon_data where poster_storage_id=? \
																${whereShid} and (poster_ingredient_id=?)`

		let sqlLeftovers =
			await this.SyncSelectQuery(sqlQuery, [storage.poster_id, poster_ingredient_id]);
							count++;
							if (sqlLeftovers.length > 0) {
								let sqlIngredient = sqlLeftovers[0];

								ingredient.min_left = sqlIngredient.min_left;
								ingredient.s2i_min_left = sqlIngredient.s2i_min_left;
								ingredient.poster_min_left = sqlIngredient.poster_min_left;
								ingredient.sh2i_min_left = sqlIngredient.sh2i_min_left;
								ingredient.min_left_info = sqlIngredient.min_left_info;

								ingredient.max_left = sqlIngredient.max_left;
								ingredient.s2i_max_left = sqlIngredient.s2i_max_left;
								ingredient.sh2i_max_left = sqlIngredient.sh2i_max_left;
								ingredient.max_left_info = sqlIngredient.max_left_info;

								ingredient.cost = parseFloat(sqlIngredient.cost) < 0 ? -1 : parseFloat(sqlIngredient.cost) / 100;
								ingredient.s2i_cost = parseFloat(sqlIngredient.s2i_cost) < 0 ? -1 : parseFloat(sqlIngredient.s2i_cost) / 100;
								ingredient.sh2i_cost = parseFloat(sqlIngredient.sh2i_cost) < 0 ? -1 : parseFloat(sqlIngredient.sh2i_cost) / 100;
								ingredient.poster_cost = parseFloat(sqlIngredient.poster_cost) < 0 ? -1 : parseFloat(sqlIngredient.poster_cost) / 100;
								ingredient.cost_info = sqlIngredient.cost_info;

								ingredient.supplier = sqlIngredient.suid;
								ingredient.supplier_info = sqlIngredient.supplier_info;
								ingredient.poster_suid = sqlIngredient.poster_suid;
								ingredient.s2i_suid = sqlIngredient.s2i_suid;
								ingredient.sh2i_suid = sqlIngredient.sh2i_suid;

								ingredient.storage = sqlIngredient.sid;

								ingredient.amount = sqlIngredient.amount;
								ingredient.s2i_amount = sqlIngredient.s2i_amount;
								ingredient.sh2i_amount = sqlIngredient.sh2i_amount;
								ingredient.amount_info = sqlIngredient.amount_info;
								ingredient.usage = parseInt(sqlIngredient.shid) < 0 ? 0 : sqlIngredient.shid;
							} else {
								console.log("opps...")
							}
							ingredient.unit = leftRow.ingredient_unit;
							ingredient.leftover = parseFloat(leftRow.storage_ingredient_left);
							ingredient.srcLeftover = JSON.parse(JSON.stringify(leftRow));
						}
					}
				}
			}
			console.log("Ok");
			return storages;
		}catch(err){
			console.log(err);
			return {};
		}
	}

	getLeftovers = async (menuStruct=null, storage=-1) =>{

		try{
			let storage_id = typeof(storage) === 'object' ? parseInt(storage.poster_id) : parseInt(storage);
			let struct = await this.getStorages(storage);
			menuStruct = menuStruct ? menuStruct : await this.getMenu(storage);

				for(let k in struct){
					let element = struct[k];
					// const stKey = this.getKey();
					element.leftovers = JSON.parse(JSON.stringify(menuStruct.childs));
					
					let leftMenuStruct = element.leftovers;
					let storage = `&storage_id=${element.poster_id}`
					let url = `${PosterConnectProperties.host}storage.getStorageLeftovers?token=${PosterConnectProperties.token}&zero_leftovers=true${storage}`
					let response = await axios.get(url);
					let leftoverRows = response.data.response;

					let count = 0;
					for(let l in leftoverRows){
						let leftRow = leftoverRows[l];
						let ingredient = this.findUnitFromMenu(leftRow, leftMenuStruct);
						if(ingredient){
							const poster_ingredient_id = parseInt(leftRow.ingredient_id);
		let sqlLeftovers = 
				await this.SyncSelectQuery("select * from for_storage_defaults where \
					poster_storage_id=? and poster_ingredient_id=?", [element.poster_id, poster_ingredient_id]);
							count++
							console.log(`${count} Finded... ${ingredient.name} in struct...`);
							if(sqlLeftovers.length > 0){
								let sqlIngredient = sqlLeftovers[0];

								ingredient.max_left = sqlIngredient.max_left;
								ingredient.s2i_max_left = sqlIngredient.s2i_max_left;
								ingredient.max_left_info = sqlIngredient.max_left_info;

								ingredient.min_left = sqlIngredient.min_left;
								ingredient.s2i_min_left = sqlIngredient.s2i_min_left;
								ingredient.poster_min_left = sqlIngredient.poster_min_left;
								ingredient.min_left_info = sqlIngredient.min_left_info;

								ingredient.cost = parseFloat(sqlIngredient.cost) < 0 ? -1 : parseFloat(sqlIngredient.cost) / 100;
								ingredient.s2i_cost = parseFloat(sqlIngredient.s2i_cost) < 0? -1 : parseFloat(sqlIngredient.s2i_cost) / 100;
								ingredient.poster_cost = parseFloat(sqlIngredient.poster_cost) < 0 ? -1: parseFloat(sqlIngredient.poster_cost) / 100;
								ingredient.cost_info = sqlIngredient.cost_info;

								ingredient.supplier = sqlIngredient.suid;
								ingredient.supplier_info = sqlIngredient.supplier_info;
								ingredient.poster_suid = sqlIngredient.poster_suid;
								ingredient.s2i_suid = sqlIngredient.s2i_suid;
								ingredient.sh2i_suid = -1;

								ingredient.storage = sqlIngredient.sid;

								ingredient.amount = sqlIngredient.amount;
								ingredient.amount_info = sqlIngredient.amount_info;
								ingredient.usage = parseInt(sqlIngredient.id) < 0 ? 0 : sqlIngredient.id;
							}
							ingredient.unit = leftRow.ingredient_unit;
							ingredient.leftover = parseFloat(leftRow.storage_ingredient_left);
							ingredient.srcLeftover = JSON.parse(JSON.stringify(leftRow));
						} else{
							console.log(`eeeeee ${leftRow.ingredient_id} :`, leftRow);
						}
					}
				}
			console.log("Ok");
			return struct;
		} catch(err){
			console.log(err);
			return {};
		}
	}
	
	async updateSupplier(data){
		const sqlid = parseInt(data.id);
		const type_delivery_info = parseInt(data.type_delivery_info);
		const address_delivery_info = data.address_delivery_info;

		let query = "update suppliers set type_delivery_info='?', address_delivery_info=? where id=? ";
		let res = await this.SyncSelectQuery(query, [type_delivery_info, address_delivery_info, sqlid]);

		res = await this.getSuppliers();

		return res;
	}

	async getFirmInfo(){
		let command = "settings.getAllSettings";
		let url = `${PosterConnectProperties.host}${command}?token=${PosterConnectProperties.token}`;
		let firmInfo = await axios.get(url);
		let info = firmInfo.data.response;

		url = `https://${info.COMPANY_ID}.joinposter.com${info.logo}`;
		let imResult = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		});
		// let image = Buffer.from(imResult.data, 'binary').toString('base64');

		const Fs = require('fs')
		const Path = require('path')  

		const path = Path.resolve(__dirname, '../images', 'firmLogo.png')
		const writer = Fs.createWriteStream(path)

		imResult.data.pipe(writer)

		firmInfo.data.firmLogoUrl = url;
		firmInfo.data.firmEmail = info.email;
		// firmInfo.logoBin = image;

		const t = new Promise((resolve, reject) =>{
			writer.on('finish', resolve)
			writer.on('error', reject)
		})

		return firmInfo.data;
	}

	async getFirmLogoBin(){
		const fs = require('fs');
		try{
			if( fs.existsSync('../images/firmLogo.png')){
				var base64 = require('node-base64-image');

				var path = __dirname + '/../images/test.jpg',
					options = { localFile: true, string: true };
				base64.base64encoder(path, options, function (err, image) {
					if (err) { console.log(err); 
						return "";
					}
					console.log(image);
					return image;
				}); 			
			} else {
				let command = "settings.getAllSettings";
				let url = `${PosterConnectProperties.host}${command}?token=${PosterConnectProperties.token}`;
				let firmInfo = await axios.get(url);
				let info = firmInfo.data.response;

				url = `https://${info.COMPANY_ID}.joinposter.com${info.logo}`;
				let imResult = await axios({
					url,
					method: 'GET',
					responseType: 'stream'
				});
				let image = Buffer.from(imResult.data.readableBuffer.head.data, 'binary').toString('base64');

				const Fs = require('fs')
				const Path = require('path')

				const path = Path.resolve(__dirname, '../images', 'firmLogo.png')
				const writer = Fs.createWriteStream(path)

				imResult.data.pipe(writer)
				return image;
			}
		} catch {
			return null;
		}

	}

	async deleteShablon(storage_id, shablon){
		try{
			let params = [parseInt(shablon)]
			let query = "Delete from shablons where id=?";

			let res = await this.SyncSelectQuery(query, params);

			return await this.getShablons(storage_id);
		} catch(err){
			return err;
		}
	}

	async getShablons(storage_id =-1, shablon = -1){
		let where_st = "";
		let where_sh = "";

		let params = [];
		if(storage_id >=0){
			where_st = 'and storage_id=?';
			params.push(parseInt(storage_id));
		};
		if(shablon >= 0){
			where_sh = 'and id=?';
			params.push(parseInt(shablon));
		}
		let query = `Select * from for_shablons where 1=1 ${where_st} ${where_sh}`;

		let result = await this.SyncSelectQuery(query, params);

		let res = {storages:{}};
		for(let k in result){
			let shablon = result[k];
			let storage_id = parseInt(shablon.storage_id);
			if(!res.storages[storage_id]){
				res.storages[storage_id] = {id: storage_id, rows: {}};
			}
			let rows = res.storages[storage_id].rows;
			let key = parseInt(shablon.id);
			if(!rows[key]){
				rows[key] = {
					id: key,
					name: shablon.name,
					type: shablon.type,
					time: shablon.time,
					active: shablon.active,
					storage_id: shablon.storage_id,
					days: []
				}
			}
			if(parseInt(shablon.day) >=0){
				rows[key].days.push(parseInt(shablon.day))
			}
			// console.debug("kfdslvlfdk");
		}
		return res;
	}

	myParseInt(strNum){
		try{
			if(typeof(strNum) === "boolean"){
				return strNum ? 1 : 0;
			}
			return parseInt(strNum);
		} catch(e){
			return -1;
		}
	}
	async updateShablon(data){
		try{
			let shablon_id = this.myParseInt(data.shablon.id);
			let ress = await this.SyncSelectQuery("select * from shablons where id=?", [shablon_id]);

			if(ress.length > 0){
				let params = [data.shablon.name, data.shablon.time, this.myParseInt(data.shablon.type), this.myParseInt(data.shablon.active), shablon_id];
				let resu = await this.SyncSelectQuery("update shablons set name=?, time=?, type_days=?, active=? where id=?", params);

				let resd = await this.SyncSelectQuery("delete from shedulers where shablon_id=?", [shablon_id]);
				const days = data.shablon.days;
				for(let i=0; i<days.length; i++){
					let d = this.myParseInt(days[i]);
					let resi = await this.SyncSelectQuery("insert into shedulers (shablon_id, day) values (?,?)", [shablon_id, d])
				}
			} else {
				throw("Error!!! Not found shablon key...", data);
			}	
			return true;
		} catch(err){
			return err;
		}
	}

	async newShablon(data){
		try{
			let storage_id = this.myParseInt(data.storage.id)
			let params = [storage_id, data.shablon.name, data.shablon.time, this.myParseInt(data.shablon.type), this.myParseInt(data.shablon.active)];
			let query = "insert into shablons (storage_id, name, time, type_days, active) values(?, ?, ?, ?, ?); \
				Select LAST_INSERT_ID() ind";
			let res = await this.SyncSelectQuery(query, params);

//			let req_uKeys = await this.SyncSelectQuery("");
			if(res.length > 0){

				let key = -1;
				if (res[0].insertId){
					key = this.myParseInt(res[0].insertId);
				} else if(res.length > 1){
					if (res[1].ind){
						key = this.myParseInt(res[1].ind)
					}
				}
				if(key < 0){
					throw ("Error!!! Unknown inserted key...")
				}

				const days = data.shablon.days;
				for(let i=0; i<days.length; i++){
					let d = this.myParseInt(days[i]);
					let resd = await this.SyncSelectQuery("insert into shedulers (shablon_id, day) values (?, ?)", [key, d]);
				}
			} else {
				throw("Error!!! Not found inserted key generate...", data);
			}
			return true;
		} catch(err){
			return err;
		}
	}

	async modifyShablon(data){
		let shablon_id = this.myParseInt(data.shablon.id);
		let storage_id = this.myParseInt(data.storage.id);
		try{
			if(shablon_id < 0){
				let resi = await this.newShablon(data);
			} else {
				let resu = await this.updateShablon(data);
			}
			return await this.getShablons(storage_id);
		} catch(err){
			return err;
		}
	}

	async shablon_update_ingredients(data){
		let storage_id = parseInt(data.storage.id);
		let shablon_id = parseInt(data.shablon.id);
		try{
			const ingValues = Object.values(data.ingredients);
			for(let ingredient of ingValues){
				let i_id = parseInt(ingredient.id);
				let p = [i_id, shablon_id];
				let ress = await this.SyncSelectQuery('select * from sh2i_add where ingredient_id=? and shablon_id=?', p);
				let usage = parseInt(ingredient.usage);
				let noShablon = ['poster', 's2i'];
				if(usage === 0){
					if(ress.length > 0){
						let resd = await this.SyncSelectQuery('delete from sh2i_add where ingredient_id=? and shablon_id=?', p);
						console.log(`deleted ingredient ${i_id} to shablon ${shablon_id}`)
					}
				} else {
					let ip = [
					noShablon.indexOf(ingredient.min_left_info) < 0 ? parseFloat(ingredient.min_left) : -1,
					noShablon.indexOf(ingredient.max_left_info) < 0 ? parseFloat(ingredient.max_left) : -1,
					noShablon.indexOf(ingredient.cost_info) < 0 ? parseFloat(ingredient.cost) * 100 : -1,
					noShablon.indexOf(ingredient.amount_info) < 0 ? parseFloat(ingredient.amount) : -1,
					noShablon.indexOf(ingredient.supplier_info) < 0 ? parseInt(ingredient.supplier) : -1,
					shablon_id,
					i_id
					];
					if (ress.length > 0) { // update 
						// let ip_u = [...ip, shablon_id, i_id];
						let resu = await this.SyncSelectQuery('update sh2i_add set \
							min_left = ?, \
							max_left = ?, \
							cost = ?, \
							amount = ?, \
							supplier_id =? \
							where shablon_id=? and ingredient_id=?', ip);
						console.log(`update ingredient ${i_id} to shablon ${shablon_id}`)
					} else { // insert
						// let ip_u = [...ip, i_id];
						let resi = await this.SyncSelectQuery('insert into sh2i_add (\
							min_left, max_left, cost, amount, supplier_id, shablon_id, ingredient_id) \
							values (?, ?, ?, ?, ?, ?, ?) \
							', ip);
						console.log(`insert ingredient ${i_id} to shablon ${shablon_id}`)
					}
				}
			}
			let menu = await this.getMenu(data.storage.poster_id);
			let ret = await this.getLeftoversShablon(data.shablon.id, menu, data.storage.poster_id);
			return ret;

		} catch(err){
			return err;
		}
	}

	async storage_update_ingredients(data){
		let storage_id = parseInt(data.storage.id);
		try{
			const ingValues = Object.values(data.ingredients);

			for (let ingredient of ingValues){
				let i_id = parseInt(ingredient.id) 
				let p = [i_id, storage_id];
				let ress = await this.SyncSelectQuery('select * from st2i_add where ingredient_id=? and storage_id=?', p);
				let usage = parseInt(ingredient.usage);
				if(usage === 0){
					if(ress.length > 0){
						let resd = await this.SyncSelectQuery('delete from st2i_add where ingredient_id=? and storage_id=?', p);
						console.log(`deleted ingredient ${i_id} to storage ${storage_id}`)
					}
				} else {
					let ip = [
						ingredient.min_left_info === 'poster' ? -1 : parseFloat(ingredient.min_left),
						parseInt(ingredient.max_left),
						ingredient.cost_info === 'poster' ? -1 : ((parseFloat(ingredient.cost) < 0 || ingredient.cost === "") ? -1 : parseFloat(ingredient.cost * 100).toFixed(0)),
						parseFloat(ingredient.amount),
						parseInt(ingredient.supplier),
					];
					if(ress.length > 0){ // update 
						let uid = parseInt(ress[0].id);
						ip = [...ip, uid];
						let query = "update st2i_add \
								set min_left=?, \
								max_left=?, \
								cost=?, \
								amount=?, \
								supplier_id=? where id=?";
						let resu = await this.SyncSelectQuery(query, ip);

						console.log(`update ingredient ${i_id} to storage ${storage_id}`)
					} else {
						ip = [...ip, ...p];
						let query = "insert into st2i_add ( \
								min_left, \
								max_left, \
								cost, \
								amount, \
								supplier_id, \
								ingredient_id, \
								storage_id) values (?, ?, ?, ?, ?, ?, ?)";
						let resi = await this.SyncSelectQuery(query, ip);

						console.log(`addader ingredient ${i_id} to storage ${storage_id}`)
					}
				}
			}
			let menu = await this.getMenu(data.storage.poster_id);
			let ret = await this.getLeftovers(menu, data.storage.poster_id);
			return ret;
		} catch(err){
			return err;
		}
	}

	async makeStorageOrdersExcel(data){
		try {
			var xL = require('exceljs');

			let wb = new xL.Workbook();
			// let data = Array.isArray(data_) ? data_ : Object.values(data_);
			let fns = [];

			for (let [st_Index, storage] of Object.entries(data.storages)) {
				if(!storage.suppliers){
					continue;
				}

				for (let [sup_Index, supplier] of Object.entries(storage.suppliers)){
					if(!supplier.ingredients || supplier.ingredients.length <= 0){
						continue;
					}
					let isHeader = false; let rowTableBegin = 9; let count = 0; let allSumm = 0; let TableRowCurrent = rowTableBegin;
					let r = await wb.xlsx.readFile(`${process.cwd()}/public/javascripts/order_template.xlsx`);
					let ws = wb.getWorksheet(1);

					for(let [ing_index, ingredient] of Object.entries(supplier.ingredients)){
						TableRowCurrent = rowTableBegin + (count);
						count++;
						allSumm += parseFloat(ingredient.summ);
						if(!isHeader){
							isHeader = true;
							let now = new Date()
							let day = now.getDate();
							let month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'][now.getMonth()];
							let year = now.getFullYear();
							let num = supplier.number ? supplier.number : (Math.random() * 1000).toFixed(0);
							num = `${storage.id}/${supplier.id}-${num}`;

							let pathToLogo = `${process.cwd()}/public/images/firmLogo.png`;
							pathToLogo = Path.normalize(pathToLogo);
							if(fs.existsSync(pathToLogo)){

								let logo = wb.addImage({
									filename: pathToLogo,
									extension: 'png',
								})

								ws.addImage(logo, {tl: { col: 0, row: 0 },
									br: { col: 1, row: 1 }}
								);
							}

							ws.getCell('E1').value = `"${day}" ${month} ${year}г.`;

							ws.getCell('A2').value = `Накладная № ${num}`;
							ws.getCell('B4').value = supplier.name;
							ws.getCell('C4').value = `"${supplier.src.supplier_adress}, т.${supplier.src.supplier_phone}"`;
							ws.getCell('B6').value = `${data.firm.response.company_name} - ${storage.name}`;
							ws.getCell('C6').value = `"${storage.src.storage_adress}`;

						}
						let fix = ingredient.unit === "шт." ? 0 : 3;
						let rowValues = [`${count}.`,ingredient.name, ingredient.unit, 
							parseFloat(ingredient.amount).toFixed(fix), 
							parseFloat(ingredient.cost).toFixed(2), 
							parseFloat(ingredient.summ).toFixed(2)];

						ws.spliceRows(TableRowCurrent, 0, rowValues);
						let r = ws.getRow(TableRowCurrent);
						let nr = ws.getRow(TableRowCurrent+1);
						r.style = nr.style;
						for(let i=1; i<=nr.cellCount; i++){
							r.getCell(i).style = nr.getCell(i).style;
						}


						console.log(ingredient);
					}
					let row = ws.getRow(TableRowCurrent);
					row.getCell(4).value = count;
					row.getCell(6).value =allSumm;

//					ws.commit();

					if(isHeader){
//						wb.commit();
						const name = `order${fns.length}.xlsx`;
						let path = `${process.cwd()}/public/javascripts/${name}`;
						path = Path.normalize(path);
						let res = await wb.xlsx.writeFile(`${path}`);
						fns.push({name: name, path: path});
					}
				}

			}
			console.log("exit from xls function success...");
			return fns;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async makeShablonOrdersExcel(data) {
		try {
			var xL = require('exceljs');

			let wb = new xL.Workbook();
			// let data = Array.isArray(data_) ? data_ : Object.values(data_);
			let fns = [];

			for (let [st_Index, storage] of Object.entries(data.storages)) {
				if (!storage.shablons) {
					continue;
				}
				for (let [sh_Index, shablon] of Object.entries(storage.shablons)){
					if(!shablon.suppliers){
						continue;
					}

					for (let [sup_Index, supplier] of Object.entries(shablon.suppliers)) {
						if (!supplier.ingredients || supplier.ingredients.length <= 0) {
							continue;
						}
						let isHeader = false; let rowTableBegin = 9; let count = 0; let allSumm = 0; let TableRowCurrent = rowTableBegin;
						let r = await wb.xlsx.readFile(`${process.cwd()}/public/javascripts/order_template.xlsx`);
						let ws = wb.getWorksheet(1);

						for (let [ing_index, ingredient] of Object.entries(supplier.ingredients)) {
							TableRowCurrent = rowTableBegin + (count);
							count++;
							allSumm += parseFloat(ingredient.summ);
							if (!isHeader) {
								isHeader = true;
								let now = new Date()
								let day = now.getDate();
								let month = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'][now.getMonth()];
								let year = now.getFullYear();
								let num = supplier.number ? supplier.number : (Math.random() * 1000).toFixed(0);
								num = `${storage.id}/${supplier.id}-${num}`;

								let pathToLogo = `${process.cwd()}/public/images/firmLogo.png`;
								pathToLogo = Path.normalize(pathToLogo);
								if (fs.existsSync(pathToLogo)) {

									let logo = wb.addImage({
										filename: pathToLogo,
										extension: 'png',
									})

									ws.addImage(logo, {
										tl: { col: 0, row: 0 },
										br: { col: 1, row: 1 }
									}
									);
								}

								ws.getCell('E1').value = `"${day}" ${month} ${year}г.`;

								ws.getCell('A2').value = `Накладная № ${num}`;
								ws.getCell('B4').value = supplier.name;
								ws.getCell('C4').value = `"${supplier.src.supplier_adress}, т.${supplier.src.supplier_phone}"`;
								ws.getCell('B6').value = `${data.firm.response.company_name} - ${storage.name}`;
								ws.getCell('C6').value = `"${storage.src.storage_adress}`;

							}
							let fix = ingredient.unit === "шт." ? 0 : 3;
							let rowValues = [`${count}.`, ingredient.name, ingredient.unit,
							parseFloat(ingredient.amount).toFixed(fix),
							parseFloat(ingredient.cost).toFixed(2),
							parseFloat(ingredient.summ).toFixed(2)];

							ws.spliceRows(TableRowCurrent, 0, rowValues);
							let r = ws.getRow(TableRowCurrent);
							let nr = ws.getRow(TableRowCurrent + 1);
							r.style = nr.style;
							for (let i = 1; i <= nr.cellCount; i++) {
								r.getCell(i).style = nr.getCell(i).style;
							}


							console.log(ingredient);
						}
						let row = ws.getRow(TableRowCurrent);
						row.getCell(4).value = count;
						row.getCell(6).value = allSumm;

						//					ws.commit();

						if (isHeader) {
							//						wb.commit();
							const name = `order${fns.length}.xlsx`;
							let path = `${process.cwd()}/public/javascripts/${name}`;
							path = Path.normalize(path);
							let res = await wb.xlsx.writeFile(`${path}`);
							fns.push({ name: name, path: path });
						}
					}
				}

			}
			console.log("exit from xls function success...");
			return fns;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async storagePosterSupplySyncronize(days=90){
		let storages = {}; let suppliers = {}; let ingredients = {}; let res_supplies = {}; let supplies = {};

		const toStrNum = (num) => {
			let n = parseInt(num);
			return (n < 10 ? '0' : '') + String(n);
		}

		let stRes = await this.SyncSelectQuery('select * from storages');
		for(let storage of stRes){
			storages[storage.poster_id] = Object.assign({}, storage);
		}
		let suRes = await this.SyncSelectQuery('select * from suppliers');
		for(let supplier of suRes){
			suppliers[supplier.poster_id] = Object.assign({}, supplier);
		}
		let ingRes = await this.SyncSelectQuery('select * from ingredients');
		for(let ingredient of ingRes){
			ingredients[ingredient.poster_id] = Object.assign({}, ingredient);
		}

		let supRes = await this.SyncSelectQuery('select * from poster_supplies');
		for (let supply of supRes) {
			supplies[supply.poster_id] = Object.assign({}, supply);
		}

		if(Object.keys(res_supplies)<1){
			let nowDate = new Date(); let fromDate = new Date(nowDate.setDate(nowDate.getDate() - days));
			let from = `${fromDate.getFullYear()}${toStrNum(fromDate.getMonth()+1)}${toStrNum(fromDate.getDate())}`;
			let url = `${PosterConnectProperties.host}storage.getSupplies?token=${PosterConnectProperties.token}&from=${from}`
			let response = await axios.get(url);
			for(let supply of response.data.response){
				let key = parseInt(supply.supply_id); 
				supply.poster_storage_id = parseInt(supply.storage_id);
				supply.poster_supplier_id = parseInt(supply.supplier_id);
				supply.poster_supply_id = parseInt(supply.supply_id);
				supply.storage_id = storages[supply.poster_storage_id].id;
				supply.supplier_id = suppliers[supply.poster_supplier_id].id;
				supply.supply_id = supplies[key] ? supplies[key].id : -1;
				supply.date = new Date(supply.date);
				supply.supply_id = parseInt(supply.supply_id);
				res_supplies[key] = supply;
				let urli = `${PosterConnectProperties.host}storage.getSupplyIngredients?token=${PosterConnectProperties.token}&supply_id=${key}`;
				let responsei = await axios.get(urli);
				let ings = [...responsei.data.response];
				res_supplies[key].ingredients = {};
				for (let ingredient of ings){
					let keyi = parseInt(ingredient.ingredient_id);
					ingredient.poster_ingredient_id = keyi;
					ingredient.ingredient_id = ingredients[keyi].id;
					ingredient.summ = ingredient.supply_ingredient_num > 0 ? ((ingredient.supply_ingredient_sum / ingredient.supply_ingredient_num) / 100 ) : 0;
					ingredient.summ_netto = ingredient.supply_ingredient_num > 0 ? ((ingredient.supply_ingredient_sum_netto / ingredient.supply_ingredient_num) / 100) : 0;

					res_supplies[key].ingredients[keyi] = ingredient;
				}
			}
//			supplies = response.data.response;
		}
		let finish = true;
		do{
			finish = true;
			for(let [key, supply] of Object.entries(res_supplies)){
				// let sql_supplies = await this.SyncSelectQuery('Select * from poster_supplies where poster_id=?', [supply.supply_id]);
				if(supply.supply_id < 0){
					// console.log('to do inserted supply ...');
					finish = false;
					let ipr = [
						supply.poster_supply_id,
						supply.storage_id,
						supply.poster_storage_id,
						supply.supplier_id,
						supply.poster_supplier_id,
						supply.date
					]
					let ires = await this.SyncSelectQuery("insert into poster_supplies \
						(poster_id, storage_id, poster_storage_id, supplier_id, poster_supplier_id, date) values (?, ?, ?, ?, ?, ?)", ipr);
					if(ires.affectedRows > 0){
						let lastKey = [ires.insertId];
						let dres = await this.SyncSelectQuery("delete from poster_supply_ingredients where supply_id=?",lastKey);
						supply.supply_id = lastKey[0];
						for(let [key, ingredient] of Object.entries(supply.ingredients)){
							let cost = parseFloat(ingredient.supply_ingredient_num) > 1e-3 ? ingredient.supply_ingredient_sum / parseFloat(ingredient.supply_ingredient_num) : 0;
							let ipr = [
								supply.supply_id,
								ingredient.ingredient_id,
								ingredient.poster_ingredient_id,
								ingredient.supply_ingredient_num,
								cost
							]
							let ires = await this.SyncSelectQuery('insert into poster_supply_ingredients \
								(supply_id, ingredient_id, poster_ingredient_id, amount, cost) values (?, ?, ?, ?, ?)', ipr);
							if(ires.affectedRows > 0){
								// console.log(`ok ${ingredient.ingredient_name}`);
							}
						}
					}
					// continue;
				} else {
					// console.log("to do probe update supply ...");
					let spr = [supply.supply_id];
					let sres = await this.SyncSelectQuery('select * from poster_supplies where id=?',[spr]);
					if(sres.length !== 1){
						console.log("Unknows. Remote supply and insert on next steps");
						let dres = await this.SyncSelectQuery('delete from poster_supplies where id=?', [spr]);
						supply.supply_id = -1;
						finish = false;
						continue;
					}
					let row = sres[0];
					if(supply.poster_storage_id !== row.poster_storage_id ||
						supply.poster_supplier_id !== row.poster_supplier_id){
						console.log("Differnt supplier on dtorage. Remote supply and insert on next steps");
						let dres = await this.SyncSelectQuery('delete from poster_supplies where id=?', [spr]);
						supply.supply_id = -1;
						finish = false;
						continue;
					}
					let sres2 = await this.SyncSelectQuery('select * from poster_supply_ingredients where supply_id=?', spr);
					if(sres2.length !== Object.keys(supply.ingredients).length){
						console.log("Different num ingredients. Remote poster_supply and insert on next steps");
						let dres = await this.SyncSelectQuery('delete from poster_supplies where id=?', spr);
						supply.supply_id = -1;
						finish = false;
						continue;
					}
					for (let [ikey, ingredient] of Object.entries(supply.ingredients)) {
						let spr1 = [supply.supply_id, ingredient.ingredient_id];
						let sres1 = await this.SyncSelectQuery('select * from poster_supply_ingredients where supply_id=? and ingredient_id=?', spr1);
						if (sres1.length !== 1){
							console.log("No fount ingredient. Remote poster_supply and insert on next steps");
							let dres = await this.SyncSelectQuery('delete from poster_supplies where id=?', spr);
							supply.supply_id = -1;
							finish = false;
							break;
						}
						let row = sres1[0];
						let cost = parseFloat(ingredient.supply_ingredient_num) > 1e-3 ? parseFloat(ingredient.supply_ingredient_sum) / parseFloat(ingredient.supply_ingredient_num) : 0;
						if(row.poster_ingredient_id !== ingredient.poster_ingredient_id ||
							Math.abs(parseFloat(row.amount) - parseFloat(ingredient.supply_ingredient_num)) > 1e-4 ||
							Math.abs(parseFloat(row.cost) - cost) > 1e-4){
							console.log("Different amount or cost ingredient. Remote poster_supply and insert on next steps");
							let dres = await this.SyncSelectQuery('delete from poster_supplies where id=?', spr);
							supply.supply_id = -1;
							finish = false;
							break;
						}
					}
				}
			}

		} while (!finish)	

		return res_supplies;
	}

	async getDataForStorageDefaultOrders(storage_id=-1){
		const storages = await this.getStorages(storage_id)
		let leftoversRows = {};
		let ingredients;
		let ingRes = await this.SyncSelectQuery('select * from ingredients');
		for (let ingredient of ingRes) {
			ingredients[ingredient.poster_id] = Object.assign({}, ingredient);
		}
		

		const toStrNum =(num)=>{
			let n = parseInt(num); 
			return (n<10 ? '0': '')+String(n);
		}
		for(let [skey, storage] of Object.entries(storages)){
			let storageStr = `&storage_id=${storage.poster_id}`
			let url = `${PosterConnectProperties.host}storage.getStorageLeftovers?token=${PosterConnectProperties.token}&zero_leftovers=true${storageStr}`
			let response = await axios.get(url);
			// let leftoverRows[] = response.data.response;

			let nowDate = new Date(); let fromDate = new Date(nowDate.setMonth(nowDate.getMonth-4));
			let to = `${nowDate.getFullYear()}${toStrNum(nowDate.getMonth())}${toStrNum(nowDate.getDate())}`;
			let from = `${fromDate.getFullYear()}${toStrNum(fromDate.getMonth())}${toStrNum(fromDate.getDate())}`;
			url = `${PosterConnectProperties.host}storage.getSupplies?token=${PosterConnectProperties.token}&from=${from}`
			response = await axios.get(url);
			let suppliesRows = response.data.response;
		// for(let supp)
		}
	}

	async getInitInfo(){
		let ret = {};
		// let url = `${PosterConnectProperties.host}storage.getStorages?token=${PosterConnectProperties.token}`;
		// let response = await axios.get(url);
		// let storageRows = response.data.response;

		await this.getMenu();
		ret.suppliers = await this.getSuppliers();
		ret.storages = await this.getStorages();
		ret.firmInfo = await this.getFirmInfo();

		return ret;
	}
}

module.exports = new PosterDB();