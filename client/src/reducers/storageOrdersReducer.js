import initialState from '../store/initialState';
import { actions } from '../actions';

export default function storageOrdersReducer(state = initialState, action) {
	switch (action.type) {
		case actions.storageOrders.GET_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				current: -1,
				storage: action.storage ? action.storage : -1,
				supplier: action.suppler ? action.suppler : -1,
				err: {},
				orders: {}
			})
		}
		case actions.storageOrders.GET_RESPONSE:{
			return Object.assign({}, state, {
				isFetching: false,
				orders: action.orders,
				storage: action.storage ? action.storage : -1,
				supplier: action.suppler ? action.suppler : -1,
				err: {}
			})
		}
		case actions.storageOrders.SELECT:{
			return Object.assign({}, state, {
				isFetching: false,
				current: action.id,
				err: {}
			})
		}
		case actions.storageOrders.CLEAR:{
			return Object.assign({}, state, {
				isFetching: false,
				orders: {},
				err: {},
				current: -1,
			})
		}
		case actions.storageOrders.ERROR:{
			return Object.assign({}, state, {
				isFetching: false,
				err: action.err,
				message: {}
			})
		}
		case actions.storageOrders.SEND:{
			return Object.assign({}, state, {
				isFetching: true,
				sendResult:{
					result: 0,
					message: {},
					err: {},
					showMessage: false
				}
			})
		}
		case actions.storageOrders.SEND_RESPONSE:{
			return Object.assign({}, state, {
				isFetching: false,
				sendResult:{
					message: action.result.message,
					result: action.result.result,
					err: {},
					showMessage: true
				}
			})
		}
		case actions.storageOrders.SEND_RESPONSE_ERR: {
			return Object.assign({}, state, {
				isFetching: false,
				sendResult:{
					message: {},
					result: action.result.result,
					err: action.result.error,
					showMessage: true
				}
			})
		}
		case actions.storageOrders.SEND_RESPONSE_CLOSE: {
			return Object.assign({}, state, {
				sendResult: {
					showMessage: false
				}
			})
		}

		default: return state
	}
}
