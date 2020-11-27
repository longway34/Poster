import React, { Component } from 'react';
import { connect } from 'react-redux';

import StorageOrdersView from '../components/StorageOrderView';
import { actions } from '../actions';
import { proxyHost } from '../store/constants'
import { render } from '@testing-library/react';

import StorageOrderListComponent from '../components/StorageOrderListComponent';
import OrdersSendResultDialog from '../components/OrdersSendResultDialog';

const axios = require('axios');

class StorageOrdersContainer extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isLoading: props.isLoading ? props.isLoading : true
		}

		this.onSend = this.onSend.bind(this);
	}
	

	componentDidMount(){
		if(this.state.isLoading)
		{
			if(!this.props.orders.isFetching){
				let storage_poster_id = this.props.storage ? this.props.storage.poster_id : -1;
				// if (!this.props.storage){
				// 	return;
				// }
				this.props.onGetOrders(storage_poster_id);
				const url = `${proxyHost}/storages/docs?storage_id=${storage_poster_id}`;
				axios.get(url)
				.then((response) => {
					this.setState({isLoading: false});

					const cheerio = require('cheerio');
					let d = cheerio.load(response.data);

					let _css = d('body > style').html().trim();
					let _htmls = {css: _css};
					let findResult = d('.markBeginOrder');
					findResult.each((i, element)=>{
						let storage = parseInt(findResult[i].attribs.storage);
						let supplier = parseInt(findResult[i].attribs.supplier);
						let number = findResult[i].attribs.number
						if(!_htmls.storages){
							_htmls.storages = {};
						}
						if(!_htmls.storages[storage]){
							_htmls.storages[storage] = {suppliers:{}}
						}

						if(!_htmls.storages[storage].suppliers[supplier]){
							_htmls.storages[storage].suppliers[supplier] = {htmls: []};
						}
						_htmls.storages[storage].suppliers[supplier].htmls.push({
							number: number,
							data: d(element).html()
						})
					});
					this.props.onResponseOrders(_htmls, this.props.storage_id);
//					console.log(response.data);
				})
				.catch((err) => {
					console.log(err);
				})

			}
		}
	}

	onSend(storage_id, supplier_id){
		if(this.props.onSend){
			this.props.onSend(storage_id, supplier_id);
		}
	}

	render(){
		let content = [(
			<StorageOrderListComponent storages={this.props.storages} suppliers={this.props.suppliers} listOrders={this.props.listOrders} isWaiting={this.props.orders.isFetching} onSend={this.onSend} />
		)];

		return (
			<div>
				<OrdersSendResultDialog result={this.props.result} onClose={this.props.onCloseMessage}/>
				{content}
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetOrders: (storage_id = -1) => {
			dispatch(actions.storageOrders.request(storage_id));
		},
		onResponseOrders: (response, storage_id) =>{
			dispatch(actions.storageOrders.response(response, storage_id));
		},
		onErrorOrders: (err)=>{
			dispatch(actions.storageOrders.error(err));
		},
		onCloseMessage: ()=>{
			dispatch(actions.storageOrders.close_message());
		},
		onSend: (storage_id, supplier_id) =>{
			dispatch(actions.storageOrders.send(storage_id, supplier_id));
			let url = `${proxyHost}/storages/ordersSend?storage_id=${storage_id}&supplier_id=${supplier_id}`;
			axios.get(url)
			.then((result) =>{
				let res = parseInt(result.data.result);
				// if (result.data.result){
					if(parseInt(res) < 0){
						dispatch(actions.storageOrders.send_response_error(result.data));
					} else {
						dispatch(actions.storageOrders.send_response(result.data));
					}
				// } else {
				// 	dispatch(actions.storageOrders.send_response({result: 0, err: {}, message: {}}));
				// }
			})
			.catch((err) =>{
				dispatch(actions.storageOrders.error(err));
			})
		}
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.storageOrders,
		listOrders: state.storageOrders.orders,
		storage: state.storages.current < 0 ? null : state.storages.rows[state.storages.current],
		storages: state.storages,
		suppliers: state.suppliers,
		result: state.storageOrders.sendResult
	}
}

const preConnect = connect(mapStateToProps, mapDispatchToProps)(StorageOrdersContainer);

export default preConnect;
