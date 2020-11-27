import initialState from '../store/initialState';
import { actions } from '../actions';

export default function uiReducer(state = initialState, action) {
	switch (action.type) {
		case actions.ui.UI_REQUEST: {
			console.log(action.type);
			return Object.assign({}, state, {
					isFetching: true,
					isStartUpComplite: false,
					err: {}
			})
		}
		case actions.ui.UI_RESPONSE: {
			console.log(action.type);
			return Object.assign({}, state, {
				// rows: JSON.parse(JSON.stringify(action.rows)),
					isFetching: false,
					isStartUpComplite: true,
					err: {}
			});
		}
		case actions.ui.REQUEST_ERROR: {
			return Object.assign({}, state, {
					isFetching: false,
					isStartUpComplite: false,
					err: action.err
			})
		}
		default: return state;
	}
}