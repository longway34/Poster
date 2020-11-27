import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { actions } from '../actions';
import { proxyHost } from '../store/constants'

const axios = require('axios');
//const axios2 = require('axios');

class StartUpComponent extends Component {
	// static propTypes = {
	// 	connection: PropTypes.object
	// }
	componentDidMount() {
		this.props.onStart();
	}
	render() {
		return this.props.isLoading
			? (<p>Loading...</p>) : 
				this.props.isLoadedSuccess ?
				this.props.children
	: (<p>Loading: {this.props.err?this.props.err.message: ""}</p>);
	}

}

const getStorages = (dispatch) =>{
	let url = `${proxyHost}/storages`;
	dispatch(actions.storages.request())
	axios.get(url)
		.then((response) => {
			dispatch(actions.storages.response(response.data));
			dispatch(actions.suppliers.request());
			axios.get(`${proxyHost}/suppliers`)
			.then((response) =>{
				dispatch(actions.suppliers.response(response.data));
				dispatch(actions.ui.response())
			})
			.catch((err)=>{
				dispatch(actions.suppliers.error(err));
				dispatch(actions.ui.error(err));
			})
			// dispatch(actions.ui.response())
		})
		.catch(err => {
			dispatch(actions.storages.error(err));
			dispatch(actions.ui.error(err))
			console.log(err);
		});
}

// const initialiseConnection = (dispatch)=>{
// 	let url = `${proxyHost}/settings`;
// 	dispatch(actions.ui.request());
// 	dispatch(actions.settings.request());
// 	axios.get(url)
// 		.then((response)=>{
// 			dispatch(actions.settings.response(response.data));
// //			dispatch(actions.ui.response());
// 			getStorages(dispatch);
// 		})
// 		.catch((err) =>{
// 			dispatch(actions.suppliers.error(err))
// 			dispatch(actions.ui.error(err))
// 			console.log(err);
// 		});

// }

const initialiseConnection = (dispatch) => {
	let url = `${proxyHost}/settings`;
	dispatch(actions.ui.request());
	dispatch(actions.settings.request());
	axios.get(url)
		.then((response) => {
			dispatch(actions.settings.response(response.data.firmInfo));
			dispatch(actions.storages.response(response.data.storages));
			dispatch(actions.suppliers.response(response.data.suppliers));
			dispatch(actions.ui.response())
			//			dispatch(actions.ui.response());
			// getStorages(dispatch);
		})
		.catch((err) => {
			dispatch(actions.suppliers.error(err))
			dispatch(actions.ui.error(err))
			console.log(err);
		});

}

function mapStateToProps(state) {
	return {
		isLoadind: state.ui.isFetching,
		isLoadedSuccess: state.ui.isStartUpComplite,
		err: state.ui.err
	};
}
function mapDispatchToProps(dispatch) {
	return {
		onStart: ()=>{initialiseConnection(dispatch)},
//		getStorages: (dispatch)=>{getStorages(dispatch)}
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StartUpComponent);
