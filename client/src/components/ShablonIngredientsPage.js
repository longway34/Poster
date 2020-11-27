import React, { Component } from 'react';
import ProductCategoryComponent from './ProductCategoryComponent';
import ShablonIngredientComponent from './ShablonIngredientComponent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, ButtonGroup, Button } from '@material-ui/core';
import MySpinner from './MySpinner';
import { Link } from "react-router-dom";

export default function ShablonIngredientsPage(props){
	const [isChanged, setChanged] = React.useState(false);

	const onChange = (struct) => {
		if (props.onChange) {
			props.onChange(struct);
		}
		setChanged(true);
	}

	const onStore = () => {
		if (props.onStore) {
			props.onStore();
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
		for (let key in struct) {
			sortingStruct.push(struct[key])
		}
		sortingStruct.sort((a, b) => {
			let res = rangs[a.type] - rangs[b.type];
			if (res !== 0) {
				return res;
			}
			return a.name.localeCompare(b.name)
		})
		let ret = [];

		for (let i in sortingStruct) {
			const ingredient = sortingStruct[i];
			if (['product', 'ingredient'].indexOf(ingredient.type) >= 0) {
				ret.push(
					<ShablonIngredientComponent struct={ingredient} suppliers={props.suppliers} onChange={onChange} onStore={props.onStore} />
				)
			} else if (['productsCategory', 'ingredientsCategory'].indexOf(ingredient.type) >= 0) {
				ret.push(
					<ProductCategoryComponent struct={ingredient} suppliers={props.suppliers} onChange={onChange} typePage={'shablon'} onStore={props.onStore}/>
				)
			}
		}
		return ret;
	}

	const onGetOrders = () => {
		if (props.onGetOrders) {
			props.onGetOrders(props.storage);
		}
	}

	const onRefresh = () => {
		if (props.onRefresh) {
			props.onRefresh();
		}
	}

	return (
		<Grid container direction="column">
			<MySpinner hidden={props.isWaiting ? !props.isWaiting : true} x={"50vw"} y={"50vh"} />
			<Grid container direction="row" justify="space-between">
				<Grid item xs={7}>
					<Grid container direction="column">
						<Grid item xs={12} justify="center"><Typography variant="body1">Настройки заказов для склада</Typography></Grid>
						<Grid item xs={12} justify="center"><Typography variant="body2">{props.storage ? props.storage.name : "Склад не выбран"}</Typography></Grid>
						<Grid item xs={12} justify="center"><Typography variant="body1">Шаблон</Typography></Grid>
						<Grid item xs={12} justify="center"><Typography variant="body2">{props.shablon ? props.shablon.name : "Шаблон не выбран"}</Typography></Grid>
					</Grid>
				</Grid>
				<Grid item xs={5}>
					<ButtonGroup>
						<Button onClick={onGetOrders} component={Link} to={{
							pathname: "/shablonOrders",
						}}
							disabled={props.isWaiting}
						>Заявки</Button>
						<Button onClick={onRefresh}>Обновить</Button>
						<Button disabled={!isChanged} onClick={onStore}>Записать</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
			<Grid>{getContent()}</Grid>
		</Grid>
	);
}

