const getIngredientsFromStruct = (struct, ret = {}) => {
	let res = {};

	let childs = struct.childs ? struct.childs : struct;
	for (let key in childs) {
		let nextStruct; let res;
		try {
			nextStruct = childs[key];
			ret = Object.assign({}, ret, getIngredientsFromStruct(nextStruct, ret));
		} catch {
			try {
				const nextStruct = childs[parseInt(key)];
				ret = Object.assign({}, ret, getIngredientsFromStruct(nextStruct, ret));
			} catch {
				console.log(`Unit ${struct} not is own struct`);
				return ret;
			}
		}
		// ret = Object.assign({}, ret, res);

	}
	if (!struct.type) {
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
	if (Object.keys(ret).indexOf(String(supplier)) < 0) {
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

const getUnit = (struct) => {
	switch (struct.unit) {
		case "kg": return { unit: "кг.", fixed: 3 };
		case "p": return { unit: "шт.", fixed: 0 };
		case "l": return { unit: "л.", fixed: 3 };
		default: return { unit: "шт.", fixed: 0 };
	}
}

module.exports.getUnit = getUnit;
module.exports.getIngredientsFromStruct = getIngredientsFromStruct;
