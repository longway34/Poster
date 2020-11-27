import React, { Component } from 'react';
import { connect } from 'react-redux'
import { actions } from '../actions'
import StorageIngredientsPage from '../components/StorageIngredientsPage'
import { proxyHost } from '../store/constants'

const axios = require('axios');
//axios.defaults.headers.common = {};

class StorageIngredientsPageContainer extends Component {

	constructor(props) {
		super(props);
		
		this.onStore = this.onStore.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onGetOrders = this.onGetOrders.bind(this);
	}

	onGetOrders(){
		if(this.props.onGetOrders){
			this.props.onGetOrders(this.props.storage);
		}
	}

	onRefresh(){
		if(this.props.onRefresh){
			this.props.onRefresh(this.props.storage);
		}
	}

	onStore(ingredient=null){
		if(this.props.onStore){
			this.props.onStore(this.props.storage, this.props.ingredients, ingredient);
		}
	}

	onChange(struct){
		if(this.props.onChange){
			this.props.onChange(struct);
		}
	}

	render() {
		return (
			<StorageIngredientsPage 
				suppliers={this.props.suppliers} 
				ingredients={this.props.ingredients.struct} 
				storage={this.props.storage} 
				isWaiting={this.props.ingredients.isFetching}
				onRefresh={this.onRefresh}
				onStore={this.onStore}
				onChange={this.onChange}
				onGetOrders={this.onGetOrders}
			/>
		);
	}
}

const mapStateToProps = (state)=>{
	return {
		storage: state.storages.rows[state.storages.current],
		suppliers: state.suppliers.rows,
		ingredients: state.storageIngredients
	}
}

const toUpdateData = (ingredients, ret=null)=>{
	ret = ret ? ret : {} ;
	for(let key in ingredients){
		let ingredient = ingredients[key];
		if (ingredient.type && ['product', 'ingredient'].indexOf(ingredient.type) >=0){
//			key = String(key);
			ret[key] = {};
			for(let field of ['id', 'min_left', 'min_left_info', 'max_left', 'cost', 'cost_info', 'supplier', 'usage', 'amount']){

				ret[key][field] = String(ingredient[field] === "" ? -1 : ingredient[field]);
			}
		} else {
			if (ingredient.childs && Object.keys(ingredient.childs).length > 0){
				let res = toUpdateData(ingredient.childs, ret);
				ret = { ...ret, ...res };
			}
		}

	}
	return ret;
}


const updateStruct = (dispatch, struct, usage=null, supplier=null)=>{
	let supplier_ = supplier ? supplier : struct.supplier;
	supplier_ = parseInt(supplier_);
	const usage_ = usage ? usage : struct.usage;


	for (let key in struct.childs) {
		const nextStruct = struct.childs[key];
		updateStruct(dispatch, nextStruct, usage_, supplier_)
	}
	if(supplier_ > 0 && supplier_ !== parseInt(struct.supplier)){
		struct.supplier = supplier_;
	}
	if(usage_ !== 0 && usage_ !== struct.usage){
		struct.usage = usage_;
	}
	console.log(`commit ${struct.type}::${struct.name} supplier:${supplier_} usage: ${usage_}`);
	dispatch(actions.storageIngredients.update_store(struct))
}

const normalizeIngredient = (ingredient) => {
	let ret = Object.assign({}, ingredient);
	// let key = ret.id;
	for (let field of ['amount', 'amount_info', 'id', 'min_left', 'min_left_info', 'max_left', 'max_left_info', 'cost', 'cost_info', 'supplier', 'supplier_info', 'usage']) {

		ret[field] = String(ingredient[field] === "" ? -1 : ingredient[field]);
	}
	return ret;
}

const mapDispatchToProps = (dispatch) =>{
	return {
		onChange: (struct)=>{
			updateStruct(dispatch, struct)
		},
		onStore: (storage, ingredients, ingredient=null)=>{
			dispatch(actions.storageIngredients.update_db(storage, ingredients));
			let url = `${proxyHost}/storages/update_ingredients`;
			if(!ingredient || ingredient < 0){
				const toSendData = {storage: storage, ingredients: toUpdateData(ingredients.struct)};
				const toSendDataStr = JSON.stringify(toSendData);

				axios.defaults.headers.post['Content-Type'] = 'application/json';
				axios.post(url, toSendDataStr)
					.then((response) => {
						let data = response.data;
						console.log("Commit response...", data);
						dispatch(actions.storageIngredients.response(storage.id, response.data[storage.id].leftovers));
					})
					.catch((err) =>{
						console.log(err);					
						dispatch(actions.storageIngredients.error(err));
					})
			} else {
				const ingStruct = normalizeIngredient(ingredient);
				const toSendData = { storage: storage, ingredients: { [ingredient.id]: ingStruct } };
				const toSendDataStr = JSON.stringify(toSendData);

				axios.defaults.headers.post['Content-Type'] = 'application/json';
				axios.post(url, toSendDataStr)
					.then((response) => {
						let data = response.data;
						console.log("Commit response...", data);
						dispatch(actions.storageIngredients.response(storage.id, response.data[storage.id].leftovers));
					})
					.catch((err) => {
						console.log(err);
						dispatch(actions.storageIngredients.error(err));
					})

			}
		},
		onRefresh: (storage)=>{
			dispatch(actions.storageIngredients.request(storage));
			let url = `${proxyHost}/leftovers?storage_id=${storage.poster_id ? storage.poster_id : -1}&id=${storage.id ? storage.id : -1}`;
			axios.get(url)
				.then((response) => {
					dispatch(actions.storageIngredients.response(storage.id, response.data[storage.id].leftovers));
				})
				.catch((err) => {
					dispatch(actions.storageIngredients.error(err));
				})
		},
		onGetOrders: (storage = null, supplier = null) => {
			// let storage_id = storage && storage.id ? storage.id : -1;
			// let supplier_id =supplier = supplier && supplier.id ? supplier.id : -1;
			// dispatch(actions.storageOrders.request(storage_id, supplier_id));
			// const url = `${proxyHost}/storages/docs?storage_id=${storage_id}&supplier_id=${supplier_id}`;
			// axios.get(url)
			// 	.this((response) => {
			// 		console.log(response.data);
			// 	})
			// 	.catch((err) => {
			// 		dispatch(actions.storageOrders.error(err));
			// 	})
			}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageIngredientsPageContainer);