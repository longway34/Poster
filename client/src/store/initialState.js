const initialState = { 
	storages: {
		isFetching: false,
		lastRequest: null,
		current: -1,
		err: {},
		rows: {}
	}, 
	ingredients: {
		isFetching: false,
		rows: {}
	}, 
	suppliers: {
		isFetching: false,
		lastRequest: null,
		current: -1,
		err: {},
		rows: {}
	}, 
	ui: {
		isFetching: true,
		isStartUpComplite: false,
		err: {}
		// isAddStorageFormShow: false,
		// isAddSupplierFormShow: false,
		// isAddIngredientFormShow: false,
	},
	settings:{
		proxyHost:	"http://localhost:3001/",
		firmName: "",
		firmAddress: "",
		firmType: "",
		firmPhone: "",
		firmLogoUrl: "",
		firmOwner: "",
		firmEmail: "",
		firmLogoImage: "",
		firmPosterIdUrl: ""
	},
	shablons:{
		isFetching: false,
		lastRequest: null,
		storage: -1,
		current: -1,
		err: {},
		rows: {}
	},
	storageIngredients:{
		isFetching: false,
		lastRequest: null,
		storage: -1,
		err: {},
		struct: {}
	},
	shablonIngredients: {
		isFetching: false,
		lastRequest: null,
		storage: -1,
		shablon: -1,
		err: {},
		struct: {}
	},
	storageOrders:{
		isFetching: false,
		lastRequest: null,
		storage: -1,
		supplier: -1,
		current: -1,
		sendResult: {
			result: 0,
			err: {},
			message: {},
			showMessage: false
		},
		orders: {},
	},
	shablonOrders: {
		isFetching: false,
		lastRequest: null,
		storage: -1,
		shablon: -1,
		supplier: -1,
		current: -1,
		sendResult:{
			result: 0,
			err: {},
			message: {},
			showMessage: false
		},
		orders: {},
	}
}

export default initialState;