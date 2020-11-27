import initialState from '../store/initialState';
import { actions } from '../actions/';

export default function storagesReducer(state = initialState, action) {
	switch (action.type) {
		case actions.storages.GET_REQUEST: {
			console.log(action.type);
			return Object.assign({}, state, {
					storages_id: action.storages_id,
					isFetching: true,
//					rows: {},
					err: {}
			})
		}
		case actions.storages.GET_RESPONSE: {
//			let str = JSON.stringify(action.rows);

			let newState = {
					rows: action.rows,
					isFetching: false,
					lastRequest: new Date(),
					err: {}
			}
			console.log(action.type);
			return Object.assign({}, state, newState)
//			console.log("next, new state: ", state, newState)
//			return newState;
		}
		case actions.storages.CLEAR_LIST: {
			return Object.assign({}, state, {
					isFetching: false,
					rows: {}
			})
		}
		case actions.storages.SELECT: {
			return Object.assign({}, state, {
					current: parseInt(action.index)
			})
		}
		case actions.storages.GET_ERROR:{
			return Object.assign({}, state, {
					rows: {},
					err: action.err,
					isFetching: false
			})
		}
		default: return state;
	}
}