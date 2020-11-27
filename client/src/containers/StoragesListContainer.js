import React, { Component } from 'react';
import StoragesListComponent from '../components/StoragesListComponent'
import { connect } from 'react-redux'
import { actions } from '../actions'
import { proxyHost } from '../store/constants'

const axios = require('axios');

class StoragesListContainer extends Component {
	render() {
		return (
			<StoragesListComponent storages={this.props.storages} onSelect={this.props.onSelect} />
		);
	}
}

const mapStateToProps = (state)=>{
	return {
		storages: state.storages,
//		proxyHost: state.settings.proxtHost
	}
}

const mapDispatchToProps = (dispatch) =>{
	return {
		onSelect: (id)=>{
			dispatch(actions.storages.select(id));
			dispatch(actions.shablons.request(id));
			let url = `${proxyHost}/shablons?storage_id=${id}`;
			axios.get(url)
			.then((response)=>{
				let data = response.data;
				let rows = {};
				if(data.storages[id]){
					rows = data.storages[id].rows;
				}
				dispatch(actions.shablons.response(rows, id));
			})
			.catch((err)=>{
				dispatch(actions.shablons.error(err));
			})
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(StoragesListContainer);