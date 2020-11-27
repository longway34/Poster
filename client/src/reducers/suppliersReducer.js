import initialState from '../store/initialState';
import { actions } from '../actions';

export default function settingsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.suppliers.GET_REQUEST:{
			return Object.assign({}, state, {
//				current: action.id ? action.id : -1,
				isFetching: true,
//				rows: action.rows,
				err: {}
			})
		}
		case actions.suppliers.UP_DATE_REQUEST: {
			return Object.assign({}, state, {
				//				current: action.id ? action.id : -1,
				isFetching: true,
				//				rows: action.rows,
				err: {}
			})
		}
		case actions.suppliers.GET_RESPONSE: {
			return Object.assign({}, state, {
				current: action.id ? action.id : -1,
				isFetching: false,
				rows: action.rows,
				err: {}
			})
		}
		case actions.suppliers.CLEAR_LIST:{
			return Object.assign({}, state, {
				isFetching: false,
				current: -1,
				err: {},
				rows: {}
			})
		}
		case actions.suppliers.SELECT:{
			return Object.assign({}, state, {
				isFetching: false,
				current: action.id
			})
		}
		case actions.suppliers.ERROR:{
			return Object.assign({}, state, {
				isFetching: false,
				err: {}
			})
		}
		default: return state;
	}
}