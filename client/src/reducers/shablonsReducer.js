import initialState from '../store/initialState';
import { actions } from '../actions';
import { findObjectByName } from '../store/constants';

export default function shablonsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.shablons.GET_REQUEST: {
			return Object.assign({}, state, {
				storage: action.storage_id,
				isFetching: true,
				err: {} 
			})
		}
		case actions.shablons.CLEAR_LIST:{
			return Object.assign({}, state,{
				rows: {},
				current: -1,
				err:{}
			})
		}
		case actions.shablons.GET_RESPONSE:{
			let r = findObjectByName(action.rows, "rows");
			let rows = r ? r : action.rows;
			let keys = Object.keys(action.rows);
			let current = keys.indexOf(state.current) < 0 ? -1 : state.current;
			return Object.assign({}, state,{
				isFetching: false,
				current: current,
				rows: rows,
				storage: parseInt(action.storage),
				lastRequest: new Date(),
				err: {}
			})
		}
		case actions.shablons.ERROR:{
			console.log(action.type);
			return Object.assign({}, state, {
				isFetching: false,
				rows: {},
				current: -1,
				storage: -1,
				err: action.err
			})
		}
		case actions.shablons.UPDATE_REQUEST:{
			console.log(action.type);
			return Object.assign({}, state, {
				isFetching: true,
				err: {},
				rows: {}
			})
		}
		case actions.shablons.DEL_REQUEST: {
			console.log(action.type);
			return Object.assign({}, state, {
				isFetching: true,
				err: {},
			})
		}
		case actions.shablons.SELECT: {
			console.log(action.type);
			return Object.assign({}, state, {
				current: action.id
			})
		}

		default: return state;
	}
}