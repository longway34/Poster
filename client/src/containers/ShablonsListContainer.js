import React, { Component } from 'react';
import { connect } from 'react-redux'
import { actions } from '../actions';
import { proxyHost } from '../store/constants'
import ShablonsListComponent from '../components/ShablonsListComponent';

const axios = require('axios');

class ShablonsListContainer extends Component {
	constructor(props) {
		super(props);
		
		this.onSelect = this.onSelect.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	onSelect(id){
		if(this.props.onSelect){
			this.props.onSelect(id, this.props.storage);
		}
	}

	onDelete(id){
		if(this.props.onDelete){
			this.props.onDelete(id, this.props.storage);
		}
	}

	onChange(shablon){
		if(this.props.onChange){
			this.props.onChange(shablon, this.props.storage);
		}
	}

	render() {
		return (
			<ShablonsListComponent onSelect={this.onSelect} 
					onChange={this.onChange}
					onDelete={this.onDelete} shablons={this.props.shablons} storage={this.props.storage} />
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shablons: state.shablons,
		storage: state.storages.current >= 0 ? state.storages.rows[state.storages.current] : null,
		storages: state.storages.rows
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSelect: (id, storage) => {
			dispatch(actions.shablons.select(id));
			if(id === 0){
				dispatch(actions.storageIngredients.request(storage.id));
				let url = `${proxyHost}/leftovers?storage_id=${storage.poster_id ? storage.poster_id : -1}&id=${storage.id ? storage.id : -1}`;
				axios.get(url)
				.then((response)=>{
					dispatch(actions.storageIngredients.response(storage.id, response.data[storage.id].leftovers));
				})
				.catch((err)=>{
					dispatch(actions.storageIngredients.error(err));
				})
			} else if(id > 0) {
				console.log(`press shablon ${id} shablon for ${storage} storage...`);
				dispatch(actions.shablonIngredients.request(storage.id, id));
				let url = `${proxyHost}/shablons/leftovers?storage_id=${storage.poster_id ? storage.poster_id : -1}&shablon_id=${id}`;
				axios.get(url)
				.then((response) => {
					dispatch(actions.shablonIngredients.response(storage.id, response.data[storage.id].shablons[id].leftovers));
				})
				.catch((err) => {
					dispatch(actions.shablonIngredients.error(err));
				})
			} else {
				dispatch(actions.shablonIngredients.clear());
			}
		},
		onChange: (shablon, storage) =>{
			dispatch(actions.shablons.update_request());
			let url = `${proxyHost}/shablons/update`;
			let data = {
				storage: storage,
				shablon: shablon
			}
			axios.post(url, JSON.stringify(data))
			.then(response =>{
				dispatch(actions.shablons.clear());
				dispatch(actions.shablons.response(response.data, storage))
//				dispatch(actions.shablons.select(storage_id))
			})
			.catch(err=>{
				dispatch(actions.shablons.error(err));
			})
		},
		onDelete: (id, storage_id) =>{
			dispatch(actions.shablons.del_request(id))	
			let url = `${proxyHost}/shablons/delete?id=${id}&storage_id=${storage_id}`;
			axios.get(url)
			.then(response=>{
				dispatch(actions.shablons.clear());
				dispatch(actions.shablons.response(response.data, storage_id));
			})
			.catch(err => {
				dispatch(actions.shablons.error(err));
			})
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ShablonsListContainer);