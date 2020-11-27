export const getProxyHost = () => {
	var port = document.location.protocol === 'https:' ? '443' : '80';
	var protocol = document.location.protocol;
	return `${protocol}//longway34.ru`;
	// return `${protocol}//${document.domain}:${port}`;
	// return "http://localhost:3001";
}

export const proxyHost = getProxyHost();

export const myParseInt = (strNum) => {
	try{
		if(typeof(strNum) === "boolean"){
			return strNum ? 1 : 0;
		}
		return parseInt(strNum);
	} catch(e){
		return -1;
	}
}

export const getUnitStr = (unit) => {
	if (unit === "p") {
		return { unit: "шт.", scope: 0, step: 1 };
	}
	if (unit === "l") {
		return { unit: "л.", scope: 3, step: 0.1 };
	}
	if (unit === "kg") {
		return { unit: "кг.", scope: 3, step: 0.1 };
	}
	return {unit: "шт.", scope: 3, step: 1}
}


export const findObjectByName = (object, name) =>{
	if(typeof(object) !== "object"){
		return null;
	}
	try{
		const keys = Object.keys(object);
		for(let i=0; i<keys.length; i++){
			let key = keys[i];
			let ob = object[key];
			if(String(key) === String(name)){
				return ob;
			} else {
				if(typeof(ob) === "object"){
					let r = findObjectByName(ob, name);
					if(r){
						return r;
					}
				} 
			}
		}
	} catch {
		return null;
	}
	return null;
}

const updateStructContent = (data)=>{
	return JSON.parse(JSON.stringify(data));
}