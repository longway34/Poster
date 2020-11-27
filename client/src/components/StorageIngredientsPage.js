import React, { Component } from 'react';
// import StorageIngredientsContainer from '../containers/StorageIngredientContainer';
//import StorageSupplyCategoryComponemt from '../components/StorageSupplyCategoryComponent'
import StorageIngredientComponent from '../components/StorageIngredientComponent';
import ProductCategoryComponent from './ProductCategoryComponent';
//import {ExpansionPanel} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, ButtonGroup, Button } from '@material-ui/core';
import MySpinner from './MySpinner';
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
}));

export default function StorageIngredientsPage(props){
	// const classes = useStyles();

	const [isChanged, setChanged] = React.useState(false);

	const onChange = (struct) => {
		if(props.onChange){
			props.onChange(struct);
		}
		setChanged(true);
	}

	const onStory = () =>{
		if(props.onStory){
			props.onStory();
		}
	}
	const rangs = {
		'productsCategory': 0,
		'ingredientsCategory': 1,
		'product': 2,
		'ingredient': 3
	}

	const getContent = () => {
		const struct = props.ingredients ? props.ingredients : {};
//		const keysIngredients = Object.keys(struct);
		let sortingStruct = [];
		for(let key in struct){
			sortingStruct.push(struct[key])
		}
		sortingStruct.sort((a,b) =>{
			let res = rangs[a.type] - rangs[b.type];
			if(res !== 0){
				return res;
			}
			return a.name.localeCompare(b.name)
		})
		let ret = [];

		for(let i in sortingStruct){
			const ingredient = sortingStruct[i];
			if(['product', 'ingredient'].indexOf(ingredient.type) >= 0){
				ret.push(
					<StorageIngredientComponent struct={ingredient} suppliers={props.suppliers} onChange={onChange} onStore={props.onStore}/>
				)
			} else if(['productsCategory', 'ingredientsCategory'].indexOf(ingredient.type) >=0) {
				ret.push(
					<ProductCategoryComponent struct={ingredient} suppliers={props.suppliers} onChange={onChange} typePage={'storage'} onStore={props.onStore}/>
				)
			}
		}
		return ret;
	}

	const onGetOrders = ()=>{
		if(props.onGetOrders){
			props.onGetOrders(props.storage);
		}
	}

	const onRefresh = ()=>{
		if(props.onRefresh){
			props.onRefresh();
		}
	}

	return (
		<Grid container direction="column">
			<MySpinner hidden={props.isWaiting ? !props.isWaiting : true} x={"50vw"} y={"50vh"}/>
			<Grid container direction="row" justify="space-between">
				<Grid item xs={7}>
					<Grid container direction="column">
						<Grid item xs={12} justify="center"><Typography variant="body1">Общие настройки заказов для склада</Typography></Grid>
						<Grid item xs={12} justify="center"><Typography variant="body2">{props.storage ? props.storage.name : "Название не задано"}</Typography></Grid>
					</Grid>
				</Grid>
				<Grid item xs={5}>
					<ButtonGroup>
						<Button onClick={onGetOrders} component={Link} to={{
							pathname: "/storageOrders",
							}}
							disabled={props.isWaiting}
						>Заявки</Button>
						<Button onClick={onRefresh}>Обновить</Button>
						<Button disabled={!isChanged} onClick={onStory}>Записать</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
			<Grid>{getContent()}</Grid>
		</Grid>
	);
}

