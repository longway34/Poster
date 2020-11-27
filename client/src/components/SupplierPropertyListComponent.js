import React from 'react';

import SupplierPropertyComponent from './SupplierPropertyComponent'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const temp_suppliers = {
	isFetching: true,
	lastRequest: null,
	current: -1,
	err: {},
	rows:{
		'1':{
			id: 1,
			sql_id: 1,
			name: "Основной поставщик продуктов и товаров",
			poster_id: 1,
			type_delivery_info: 0,
			address_delivery_info: "longway34@gmail.com",
			src: {
				supplier_id: "1",
				supplier_name: "Основной поставщик продуктов и товаров",
				supplier_phone: "222-222-22-22",
				supplier_adress: "На очень далеко в городе",
				supplier_comment: "",
				supplier_code: "",
				supplier_tin: "",
				delete: "0",
				sql_id: 1,
				poster_id: 1,
				address_delivery_info: "longway34@gmail.com",
				type_delivery_info: 0
			}
		},
		'2':{
			id: 2,
			sql_id: 2,
			name: "Дополнительный поставщик продуктов и товаров",
			poster_id: 2,
			type_delivery_info: 0,
			address_delivery_info: "longway34@gmail.com",
			src: {
				supplier_id: "2",			
				supplier_name: "Дополнительный поставщик продуктов и товаров",
				supplier_phone: "+7(222)333 44 44",
				supplier_adress: "Где-то на выселках, как приедешь - сразу направо...",
				supplier_comment: "Черт его знает, что за потц...",
				supplier_code: "",
				supplier_tin: "",
				delete: "0",
				sql_id: 2,
				poster_id: 2,
				address_delivery_info: "longway34@gmail.com",
				type_delivery_info: 0,
			}
		},
		'3':{
			id: 3,
			sql_id: 3,
			name: 'Валера',
			poster_id: 3,
			type_delivery_info: 0,
			address_delivery_info: 'longway34@gmail.com',
			src: {
				supplier_id: '3',
				supplier_name: 'Валера',
				supplier_phone: '380671234567',
				supplier_adress: 'пр. Петровского',
				supplier_comment: 'Мясо',
				supplier_code: '32855961',
				supplier_tin: '6449013711',
				'delete': '0',
				sql_id: 3,
				poster_id: 3,
				address_delivery_info: 'longway34@gmail.com',
				type_delivery_info: 0
			}
		}
	}
}

const useStyles = makeStyles((theme) => ({
	listItemComp: {
		marginBottom: "5px",
	},
}));


const SupplierPropertyListComponent = (props) => {

	const classes = useStyles();

	const suppliers = props.suppliers ? props.suppliers : temp_suppliers;

	const onUpdate = (supplier_info) =>{
		if(props.onUpdate){
			props.onUpdate(supplier_info);
		}
	}

	const getContent = () =>{
		let ret = [];
		for(let [sKey, supplier] of Object.entries(suppliers.rows)){
			ret.push(
				<SupplierPropertyComponent className={classes.listItemComp} onUpdate={onUpdate} supplier={supplier} />
			)
		}


		return ret
	}

	return (
		<Grid>
			{getContent()}
		</Grid>
	);
};

export default SupplierPropertyListComponent;