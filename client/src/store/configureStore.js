import {createStore} from 'redux';
import rootReducer from '../reducers';
import initialState from '../store/initialState'

// import { composeWithDevTools } from 'redux-devtools-extension';
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';

export default function configureStore(){
	// return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
	// return createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
	return createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

