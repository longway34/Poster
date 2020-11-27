import React, { Component } from 'react';
import { connect } from 'react-redux'
import { actions } from '../actions'
import StorageIngredientComponent from '../components/StorageIngredientComponent';

const axios = require('axios');

class StorageIngredientContainer extends Component {
	constructor(props) {
		super(props);
		
		this.onChange = this.onChange.bind(this);
	}
	
	render() {
		return (
			<StorageIngredientComponent 
				struct={this.props.struct} 
				suppliers={this.props.suppliers} 
				// supplier={this.props.supplier} 
				// selected={this.props.selected} 
				onChange={this.onChange}/>
		);
	}

	onChange(struct){
		if(this.props.onChange){
			this.props.onChange(struct);
		}
	}
}


const mapStateToProps = (state, ownProps) =>{
	const ownStruct = ownProps.struct ? ownProps.struct : state.storageIngredients;

	return{
		struct: ownStruct,
		suppliers: state.suppliers.rows,
		supplier: ownProps.supplier ? ownProps.supplier : -1,
		selected: ownProps.selected ? ownProps.selected : false,
	} 
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onChange: ownProps.onChange ? ownProps.onChange : (struct) =>{
			dispatch(actions.storageIngredients.update_store(struct));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageIngredientContainer);
