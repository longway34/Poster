import initialState from '../store/initialState';
import { actions } from '../actions';

export default function storageOrdersReducer(state = initialState, action) {
	switch (action.type) {
		case actions.shablonOrders.GET_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				current: -1,
				storage: action.storage ? action.storage : -1,
				supplier: action.suppler ? action.suppler : -1,
				shablon: action.shablon ? action.shablon : -1,
				err: {},
				orders: {}
			})
		}
		case actions.shablonOrders.GET_RESPONSE:{
			return Object.assign({}, state, {
				isFetching: false,
				orders: action.orders,
				storage: action.storage ? action.storage : -1,
				supplier: action.suppler ? action.suppler : -1,
				shablon: action.shablon ? action.shablon : -1,
				err: {}
			})
		}
		case actions.shablonOrders.SELECT:{
			return Object.assign({}, state, {
				isFetching: false,
				current: action.id,
				err: {}
			})
		}
		case actions.shablonOrders.CLEAR:{
			return Object.assign({}, state, {
				isFetching: false,
				orders: {},
				err: {},
				current: -1,
				shablon: -1,
			})
		}
		case actions.shablonOrders.ERROR:{
			return Object.assign({}, state, {
				isFetching: false,
				err: action.err,
				message: {}
			})
		}
		case actions.shablonOrders.SEND: {
			return Object.assign({}, state, {
				isFetching: true,
				sendResult: {
					result: 0,
					message: {},
					err: {},
					showMessage: false
				}
			})
		}
		case actions.shablonOrders.SEND_RESPONSE: {
			return Object.assign({}, state, {
				isFetching: false,
				sendResult: {
					message: action.result.message,
					result: action.result.result,
					err: {},
					showMessage: true
				}
			})
		}
		case actions.shablonOrders.SEND_RESPONSE_ERR: {
			return Object.assign({}, state, {
				isFetching: false,
				sendResult: {
					message: {},
					result: action.result.result,
					err: action.result.error,
					showMessage: true
				}
			})
		}
		case actions.shablonOrders.SEND_RESPONSE_CLOSE: {
			return Object.assign({}, state, {
				sendResult: {
					showMessage: false
				}
			})
		}

		default: return state
	}
}
