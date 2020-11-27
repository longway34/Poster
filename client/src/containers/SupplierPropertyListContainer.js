import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions'
import { proxyHost } from '../store/constants'
import SupplierPropertyListComponent from '../components/SupplierPropertyListComponent';
import MySpinner from '../components/MySpinner';

const axios = require('axios');


function mapStateToProps(state) {
	return {
		suppliers: state.suppliers
	};
}

function mapDispatchToProps(dispatch){
	return {
		onUpdate: (supplier_info) =>{
			dispatch(actions.suppliers.update_request(supplier_info));
			
			let url = `${proxyHost}/suppliers/update`;
			let dataToQuery = JSON.stringify(supplier_info);
			axios.post(url, dataToQuery)
			.then((response) =>{
				dispatch(actions.suppliers.update_response(response));
			})
			.catch((err) =>{
				dispatch(actions.suppliers.error(err));
			})
		}
	}
}

class SupplierPropertyListContainer extends Component {
	constructor(props) {
		super(props);
		
		this.onUpdate = this.onUpdate.bind(this);
	}
	
	onUpdate(supplier_info){
		if(this.props.onUpdate){
			this.props.onUpdate(supplier_info)
		}
	}

	render() {
		return (
			<div>
				<MySpinner hidden={!this.props.suppliers.isFetching} />
				<SupplierPropertyListComponent suppliers={this.props.suppliers} onUpdate={this.onUpdate} />
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SupplierPropertyListContainer);