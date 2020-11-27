import initialState from '../store/initialState';
import { actions } from '../actions';
import { findObjectByName } from '../store/constants';

export default function shablonIngredientsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.shablonIngredients.GET_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				shablon: action.shablon,
				storage: action.storage,
				struct: {},
				err: {},
			})
		}
		case actions.shablonIngredients.GET_RESPONSE:{
			return Object.assign({}, state, {
				isFetching: false,
				lastRequest: new Date(),
				storage: action.storage,
				shablon: action.shablon,
				struct: action.data,
				err: {}
			});
		}
		case actions.shablonIngredients.UPDATE_DB_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				err: {}
			})
		}
		case actions.shablonIngredients.UPDATE_STATE:{
			let newState = Object.assign({}, state);
			let part = findObjectByName(newState.struct, action.struct.id);
			if (part) {
				part = Object.assign(part, action.struct);
				return newState;
			}
			return state
		}
		case actions.shablonIngredients.ERROR:{
			return Object.assign({}, state, {
				isFetching: false,
				struct: {},
				err: action.err
			})
		}
		case actions.shablonIngredients.CLEAR_LIST:{
			return Object.assign({}, state, {
				struct: {},
				err: {}
			})
		}
		default: return state;
	}
}
