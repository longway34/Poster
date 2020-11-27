import React, { Component } from 'react';
import { connect } from 'react-redux';

import { actions } from '../actions';
import { proxyHost } from '../store/constants'

import ShablonOrderListComponent from '../components/ShablonOrderListComponent'
import OrdersSendResultDialog from '../components/OrdersSendResultDialog';

const axios = require('axios');

class StorageOrdersContainer extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isLoading: props.isLoading ? props.isLoading : true
		}
	}
	

	componentDidMount(){
		if(this.state.isLoading)
		{
			if(!this.props.orders.isFetching){
				let storage_poster_id = this.props.storage ? this.props.storage.poster_id : -1;
				let shablon_id = this.props.shablon ? this.props.shablon.id : -1;

				this.props.onGetOrders(storage_poster_id);
				const url = `${proxyHost}/shablons/docs?shablon_id=${shablon_id}&storage_id=${storage_poster_id}`;
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
						let shablon = parseInt(findResult[i].attribs.shablon);
						let number = findResult[i].attribs.number
						if(!_htmls.storages){
							_htmls.storages = {};
						}
						if(!_htmls.storages[storage]){
							_htmls.storages[storage] = {shablons:{}}
						}
						if (!_htmls.storages[storage].shablons[shablon]) {
							_htmls.storages[storage].shablons[shablon] = { suppliers: {} }
						}

						if (!_htmls.storages[storage].shablons[shablon].suppliers[supplier]){
							_htmls.storages[storage].shablons[shablon].suppliers[supplier] = {htmls: []};
						}
						_htmls.storages[storage].shablons[shablon].suppliers[supplier].htmls.push({
							number: number,
							data: d(element).html()
						})
					});
					this.props.onResponseOrders(_htmls, this.props.storage ? this.props.storage.id : -1, this.props.shablon ? this.props.shablon.id : -1);
					console.log(response.data);
				})
				.catch((err) => {
					console.log(err);
				})

			}
		}
	}

	onSend(storage_id, shablon_id, supplier_id){
		if(this.props.onSend){
			this.props.onSend(storage_id, shablon_id, supplier_id);
		}
	}

	render(){
		let content = [(
			<ShablonOrderListComponent 
			storages={this.props.storages} 
			suppliers={this.props.suppliers} 
			listOrders={this.props.listOrders} 
			isWaiting={this.props.orders.isFetching} 
			shablon={this.props.shablon}
			onSend={this.props.onSend}/>
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
			dispatch(actions.shablonOrders.request(storage_id));
		},
		onResponseOrders: (response, storage_id, shablon_id) =>{
			dispatch(actions.shablonOrders.response(response, storage_id, shablon_id));
		},
		onErrorOrders: (err)=>{
			dispatch(actions.shablonOrders.error(err));
		},
		onCloseMessage: () => {
			dispatch(actions.shablonOrders.close_message());
		},
		onSend: (storage_id, shablon_id, supplier_id) =>{
			dispatch(actions.shablonOrders.send(storage_id, shablon_id, supplier_id));
			let url = `${proxyHost}/shablons/ordersSend?storage_id=${storage_id}&shablon_id=${shablon_id}&supplier_id=${supplier_id}`;
			axios.get(url)
				.then((result) => {
					let res = parseInt(result.data.result);
					// if (result.data.result){
					if (parseInt(res) < 0) {
						dispatch(actions.shablonOrders.send_response_error(result.data));
					} else {
						dispatch(actions.shablonOrders.send_response(result.data));
					}
					// } else {
					// 	dispatch(actions.storageOrders.send_response({result: 0, err: {}, message: {}}));
					// }
				})
				.catch((err) => {
					dispatch(actions.shablonOrders.error(err));
				})
		}
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.shablonOrders,
		listOrders: state.shablonOrders.orders,
		storage: state.storages.current < 0 ? null : state.storages.rows[state.storages.current],
		storages: state.storages,
		suppliers: state.suppliers,
		shablon: state.shablons.current < 0 ? null : state.shablons.rows[state.shablons.current],
		result: state.shablonOrders.sendResult
	}
}

const preConnect = connect(mapStateToProps, mapDispatchToProps)(StorageOrdersContainer);

export default preConnect;
