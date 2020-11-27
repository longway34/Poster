// import { findObjectByName } from "../store/constants"

export const actions = {
	storages:{
		GET_RESPONSE: "GET_STORAGES_RESPONSE",
		GET_REQUEST: "GET_STORAGES_REQUEST",
		CLEAR_LIST: "CLEAR_STORAGE_LIST",
		SELECT: "SELECT_STARAGE",
		GET_ERROR:	"GET_STORAGES_ERROR",
		request: ()=>{
			return {
				type: actions.storages.GET_REQUEST,
			}
		},
		response: (rows) => {
			return {
				type: actions.storages.GET_RESPONSE,
				rows: rows
			}
		},
		clear: ()=>{
			return {
				type: actions.storages.CLEAR_LIST
			}
		},
		select: (index)=>{
			return {
				type: actions.storages.SELECT,
				index: index
			}
		},
		error: (err)=> {
			return {
				type: actions.storages.GET_ERROR,
				err: err
			}
		}
	},
// 	suppliers: {
// 		GET_REQUEST: "GET_SUPPLIERS_REQUEST",
// 		GET_RESPONSE: "GET_SUPPLIERS_RESPONSE",
// 		GET_ERROR: "GET_SUPPLIERS_ERROR",
// 		CLEAR_LIST: "CLEAR_SUPPLIERS_LIST",
// 		SELECT: "SELECT_SUPPLIER",
// 		UP_DATE_REQUEST: "UPDATE_SUPPLIER_INFO_REQUEST",
// 		UP_DATE_RESPONSE: "UPDATE_SUPPLIER_INFO_RESPONSE",
// 		UP_DATE_ERROR: "UPDATE_SUPPLIER_ERROR",

// 		request: ()=>{
// 			return {
// 				type: actions.suppliers.GET_REQUEST,
// 			}
// 		},
// 		response: (rows) =>{
// 			return {
// 				type: actions.suppliers.GET_RESPONSE,
// 				rows: rows
// 			}
// 		},
// 		error: (err) => {
// 			return {
// 				type: actions.suppliers.GET_ERROR,
// 				err: err
// 			}
// 		},
// 		clear: () => {
// 			return {
// 				type: actions.suppliers.CLEAR_LIST
// 			}
// 		},
// 		select: (index) => {
// 			return {
// 				type: actions.suppliers.SELECT,
// 				index: index
// 			}
// 		},
// 		update_request: (supplier_row) => {
// 			return{
// 				type: actions.suppliers.UP_DATE_REQUEST,
// //				row: supplier_row
// 			}
// 		},
// 		update_response: (result) =>{
// 			return {
// 				type: actions.suppliers.UP_DATE_RESPONSE,
// 				rows: result
// 			}
// 		},
// 		update_error: (err) => {
// 			return {
// 				type: actions.suppliers.UP_DATE_ERROR,
// 				err: err
// 			}
// 		}
// 	},
	ui:{
		UI_REQUEST: "START_UP_REQUEST",
		UI_RESPONSE: "START_UP_RSPONSE",
		REQUEST_ERROR: "START_UP_ERROR",
		request: ()=>{
			return {
				type: actions.ui.UI_REQUEST
			}
		},
		response: ()=>{
			return {
				type: actions.ui.UI_RESPONSE
			}
		},
		error: ()=>{
			return {
				type: actions.ui.REQUEST_ERROR
			}
		}

	},
	settings:{
		FIRM_INFO_REQUEST: "GET_FIRM_INFO_REQUEST",
		FIRM_INFO_RESPONSE: "GET_FIRM_INFO_RESPONSE",

		request: ()=>{
			return {
				type: actions.settings.FIRM_INFO_REQUEST
			}
		},
		response: (data) =>{
			return {
				type: actions.settings.FIRM_INFO_RESPONSE,
				data: data
			}
		}
	},
	shablons:{
		GET_REQUEST: "GET_SHABLONS_REQUEST",
		GET_RESPONSE: "GET_SHABLONS_RESPONSE",
		ERROR: "QUERY_SHABLONS_ERROR",
		CLEAR_LIST: "CLEAR_SHABLONS_LIST",
		SELECT: "SELECT_SHABLON",

		DEL_REQUEST: "DEL_SHABLON_REQUEST",
		DEL_RESPONSE: "DEL_SHABLON_RESPONSE",

		UPDATE_REQUEST: "UPDATE_SHABLON_REQUEST",
		UPDATE_RESPONSE: "UPDATE_SHABLON_RESPONSE",

		request: (storage, shablon = -1) => {
			return {
				type: actions.shablons.GET_REQUEST,
				storage: storage,
			}
		},
		response: (rows, storage) => {
			return {
				type: actions.shablons.GET_RESPONSE,
				rows: rows,
				storage: storage
			}
		},
		error: (err) => {
			return {
				type: actions.shablons.ERROR,
				err: err
			}
		},
		clear: () => {
			return {
				type: actions.shablons.CLEAR_LIST
			}
		},
		select: (id) => {
			return {
				type: actions.shablons.SELECT,
				id: id
			}
		},
		update_request: (storage_id) =>{
			return {
				type: actions.shablons.UPDATE_REQUEST,
				storage: storage_id,
			}
		},
		del_request: (shablon_id)=>{
			return {
				type: actions.shablons.DEL_REQUEST,
				id: shablon_id
			}
		},
	},
	shablonIngredients:{
		GET_REQUEST: "GET_SHABLON_INGREDIENTS_REQUEST",
		GET_RESPONSE: "GET_SHABLON_INGREDIENTS_RESPONSE",

		UPDATE_DB_REQUEST: "UPDATE_SHABLON_INGREDIENTS_REQUEST",
		UPDATE_STATE: "UPDATE_STATE_SHABLON_INGREDIENTS",
		ERROR: "QUERY_SHABLON_INGREDIENTS_ERROR",
		CLEAR_LIST: "CLEAR_SHABLON_INGREDIENTS_STRUCT",
		request: (shablon_id, storage_id) => {
			return {
				type: actions.shablonIngredients.GET_REQUEST,
				shablon: shablon_id,
				storage: storage_id
			}
		},
		response: (shablon_id, data, storage_id=-1) => {
			return {
				type: actions.shablonIngredients.GET_RESPONSE,
				shablon: shablon_id,
				storage: storage_id,
				data: data
			}
		},
		update_store: (struct) => {
			return {
				type: actions.shablonIngredients.UPDATE_STATE,
				struct: struct
			}
		},
		update_db: (shablon_id, data) => {
			return {
				type: actions.shablonIngredients.UPDATE_DB_REQUEST,
				storage: shablon_id,
				data: data
			}
		},
		error: (err) => {
			return {
				type: actions.shablonIngredients.ERROR,
				err: err
			}
		},
		clear: () => {
			return {
				type: actions.shablonIngredients.CLEAR_LIST
			}
		}

	},

	storageIngredients:{
		GET_REQUEST: "GET_STORAGE_INGREDIENTS_REQUEST",
		GET_RESPONSE: "GET_STORAGE_INGREDIENTS_RESPONSE",

		UPDATE_DB_REQUEST: "UPDATE_STORAGE_INGREDIENTS_REQUEST",
		UPDATE_STATE: "UPDATE_STATE_STORAGE_INGREDIENTS",
		ERROR: "QUERY_STORAGE_INGREDIENTS_ERROR",
		CLEAR_LIST: "CLEAR_STORAGE_INGREDIENTS_STRUCT",

		request: (storage_id) =>{
			return {
				type: actions.storageIngredients.GET_REQUEST,
				storage: storage_id
			}
		},
		response: (storage_id, data) =>{
			return {
				type: actions.storageIngredients.GET_RESPONSE,
				storage: storage_id,
				data: data
			}
		},
		update_store: (struct) =>{
			return {
				type: actions.storageIngredients.UPDATE_STATE,
				struct: struct
			}
		},
		update_db: (storage_id, data) => {
			return {
				type: actions.storageIngredients.UPDATE_DB_REQUEST,
				storage: storage_id,
				data: data
			}
		},
		error: (err) =>{
			return {
				type: actions.storageIngredients.ERROR,
				err: err
			}
		},
		clear: () => {
			return {
				type: actions.storageIngredients.CLEAR_LIST
			}
		}
	},
	suppliers:{
		SELECT: "SUPPLIERS_SELECT_REQUEST",
		GET_RESPONSE: "SUPPLIERS_GET_RESPONSE",
		GET_REQUEST: "SUPPLIERS_GET_REQUEST",
		UP_DATE_REQUEST: "SUPPLIERS_UP_DATE_REQUEST",
		CLEAR_LIST: "SUPPLIEST_CLEAR_LIST",
		ERROR: "SUPPLIERS_ERRORS",
		request: (id=-1)=>{
			return {
				type: actions.suppliers.GET_REQUEST,
				id: id
			}
		},
		response: (rows_data, id=-1)=>{
			const rows = rows_data.data ? rows_data.data : rows_data;
			return {
				type: actions.suppliers.GET_RESPONSE,
				id: id,
				rows: rows 
			}
		},
		clear: () =>{
			return {
				type: actions.suppliers.CLEAR_LIST
			}
		},
		select: (id) =>{
			return {
				type: actions.suppliers.SELECT,
				id: id
			}
		},
		error: (err)=>{
			return{
				type: actions.suppliers.ERROR,
				err: err
			}
		},
		update_request: (supplier_row={}) => {
			return {
				type: actions.suppliers.UP_DATE_REQUEST,
				//				row: supplier_row
			}
		},
		update_response: (result) => {
			const rows = result.data ? result.data : result;
			return {
				type: actions.suppliers.GET_RESPONSE,
				rows: rows
			}
		},
	},
	storageOrders:{
		GET_REQUEST: "STORAGE_ORDERS_GET_REQUEST",
		GET_RESPONSE: "STORAGE_ORDERS_GET_RESPONSE",
		SELECT: "STORAGE_ORDERS_SELECT",
		ERROR: "STORAGE_ORDERS_ERROR",
		CLEAR: "STOARGE_ORDERS_CLEAR_LIST",
		SEND: "STORAGE_ORDERS_SEND",
		SEND_RESPONSE: "STORAGE_ORDERS_SEND_RESPONSE",
		SEND_RESPONSE_ERR: "STORAGE_ORDERS_SEND_RESPONSE_ERROR",
		SEND_RESPONSE_CLOSE: "STORAGE_ORDERS_SEND_RESPONSE_CLOSE",

		send: (storage_id=-1, supplier_id=-1) =>{
			return {
				type: actions.storageOrders.SEND,
				storage: storage_id,
				supplier: supplier_id
			}
		},
		send_response: (result)=>{
			return {
				type: actions.storageOrders.SEND_RESPONSE,
				result: result
			}
		},
		send_response_error: (result)=>{
			return {
				type: actions.storageOrders.SEND_RESPONSE_ERR,
				result: result
			}
		},
		close_message: ()=>{
			return {
				type: actions.storageOrders.SEND_RESPONSE_CLOSE
			}
		},

		request: (storage_id=-1, supplier_id=-1) =>{
			return {
				type: actions.storageOrders.GET_REQUEST,
				storage: storage_id,
				supplier: supplier_id,
			}
		},
		response: (orders, storage_id=-1, supplier_id=-1) =>{
			return {
				type: actions.storageOrders.GET_RESPONSE,
				orders: orders,
				storage: storage_id,
				supplier: supplier_id
			}
		},
		select: (id) => {
			return {
				type: actions.storageOrders.SELECT,
				id: id
			}
		},
		clear: () => {
			return {
				type: actions.storageOrders.CLEAR,
			}
		},
		error: (err)=>{
			return {
				type: actions.storageOrders.ERROR,
				err: err
			}
		}
	},
	shablonOrders: {
		GET_REQUEST: "SHABLON_ORDERS_GET_REQUEST",
		GET_RESPONSE: "SHABLON_ORDERS_GET_RESPONSE",
		SELECT: "SHABLON_ORDERS_SELECT",
		ERROR: "SHABLON_ORDERS_ERROR",
		CLEAR: "SHABLON_ORDERS_CLEAR_LIST",
		SEND: "SHABLON_ORDERS_SEND",
		SEND_RESPONSE: "SHABLON_ORDERS_SEND_RESPONSE",
		SEND_RESPONSE_ERR: "SHABLON_ORDERS_SEND_RESPONSE_ERROR",
		SEND_RESPONSE_CLOSE: "SHABLON_ORDERS_SEND_RESPONSE_CLOSE",

		send: (storage_id = -1, shablon_id = -1, supplier_id = -1) => {
			return {
				type: actions.shablonOrders.SEND,
				storage: storage_id,
				supplier: supplier_id,
				shablon: shablon_id,
				isFetching: true
			}
		},
		send_response: (result) =>{
			return {
				type: actions.shablonOrders.SEND_RESPONSE,
				result: result
			}
		},
		send_response_error: (result) => {
			return {
				type: actions.shablonOrders.SEND_RESPONSE_ERR,
				result: result
			}
		},
		close_message: () => {
			return {
				type: actions.shablonOrders.SEND_RESPONSE_CLOSE
			}
		},

		request: (shablon_id = -1, storage_id = -1, supplier_id = -1) => {
			return {
				type: actions.shablonOrders.GET_REQUEST,
				storage: storage_id,
				supplier: supplier_id,
				shablon: shablon_id
			}
		},
		response: (orders, storage_id = -1, shablon_id = -1, supplier_id = -1) => {
			return {
				type: actions.shablonOrders.GET_RESPONSE,
				orders: orders,
				storage: storage_id,
				supplier: supplier_id,
				shablon: shablon_id
			}
		},
		select: (id) => {
			return {
				type: actions.shablonOrders.SELECT,
				id: id
			}
		},
		clear: () => {
			return {
				type: actions.shablonOrders.CLEAR,
			}
		},
		error: (err) => {
			return {
				type: actions.shablonOrders.ERROR,
				err: err
			}
		}
	}
}


