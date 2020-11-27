import initialState from '../store/initialState';
import { actions } from '../actions';
import { findObjectByName } from '../store/constants';

export default function storageIngredientsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.storageIngredients.GET_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				struct: {},
				err: {},
			})
		}
		case actions.storageIngredients.GET_RESPONSE:{
			return Object.assign({}, state, {
				isFetching: false,
				lastRequest: new Date(),
				storage: action.storage,
				struct: action.data,
				err: {}
			});
		}
		case actions.storageIngredients.UPDATE_DB_REQUEST:{
			return Object.assign({}, state, {
				isFetching: true,
				err: {}
			})
		}
		case actions.storageIngredients.UPDATE_STATE:{
			let newState = Object.assign({}, state);
			let part = findObjectByName(newState.struct, action.struct.id);
			if (part) {
				// part.min_left++;
				part = Object.assign(part, action.struct);
				// part.min_left++;
				return newState;
			}
			return state
		}
		case actions.storageIngredients.ERROR:{
			return Object.assign({}, state, {
				isFetching: false,
				struct: {},
				err: action.err
			})
		}
		case actions.storageIngredients.CLEAR_LIST:{
			return Object.assign({}, state, {
				struct: {},
				err: {}
			})
		}
		default: return state;
	}
}
