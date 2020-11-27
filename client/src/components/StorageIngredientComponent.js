import React, { Component } from 'react';
import { findObjectByName } from '../store/constants'
import { useEffect } from 'react';
import {getUnitStr} from '../store/constants'

// import FormGroup from '@material-ui/core/FormGroup'
import Typography from '@material-ui/core/Typography'
import { Checkbox, Input, Select, MenuItem, Grid, FormControl, InputAdornment, Button, FormHelperText, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
//import classes from '*.module.css';

import SentimentSatisfiedTwoToneIcon /*as trueImage*/ from '@material-ui/icons/SentimentSatisfiedTwoTone';
import SentimentDissatisfiedTwoToneIcon /*as falseImage*/ from '@material-ui/icons/SentimentDissatisfiedTwoTone';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import MoreTwoToneIcon from '@material-ui/icons/MoreTwoTone';

// const tempStruct = require('./temp_data.json');
// const tempSuppliers = require('./test_suppliers.json');

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
	},
	item:{
		padding: 3
	},
	unit:{
		fontSize: "0.8rem"
	},
	posterCost:{
		// fontSize: "0.8rem",
		color: "#20f"
	},
	s2iCost:{
		// fontSize: "0.8rem",
		color: "black"
	},
	s2iSupplier:{
		color: "#c70404"
	}
}))

export default function StorageIngredientComponent(props){
	const classes = useStyles();

		let tempStateIngredient = {};

	const str = props.struct ? props.struct : tempStateIngredient;
	const suppliers = props.suppliers ? props.suppliers : {};
	const unit = str.unit;

	const max_left = parseFloat(str.max_left);
	if (String(str.max_left).length === 0 || max_left < 0){
		str.max_left = "";
	} else {
		str.max_left = parseFloat(str.max_left).toFixed(getUnitStr(unit).scope);
	};

	const min_left = parseFloat(str.min_left);
	const poster_min_left = parseFloat(str.poster_min_left);
	if (String(str.min_left).length === 0 || min_left < 0) {
		str.min_left = "";
	} else {
		str.min_left = min_left.toFixed(getUnitStr(unit).scope);
	} 

	const cost = parseFloat(str.cost);
	const poster_cost = parseFloat(str.poster_cost);
	if (String(str.cost).length === 0 || cost < 0) {
		str.cost = "";
	} else {
		str.cost = cost.toFixed(2);
	}

	const amount = parseFloat(str.amount);
	if (String(str.amount).length === 0 || amount < 0) {
		str.amount = "";
	} else {
		str.amount = amount.toFixed(getUnitStr(unit).scope);
	} 
	
	const s2i_suid = parseInt(str.s2i_suid);
	const poster_suid = parseInt(str.poster_suid);

	const [struct, setState] = React.useState(str);
	const [changet, setChanget] = React.useState(false);

	const getSuppliersOptions =() =>{
		let ret = [];
		ret.push(
			<MenuItem value={-1} disabled>Выберите поставщика</MenuItem>
		)
		const keys = Object.keys(suppliers);
		for(let i=0; i< keys.length; i++){
			let supplier = suppliers[keys[i]];
			ret.push(
			<MenuItem value={supplier.id}>{supplier.name}</MenuItem>
			)
		}
		return ret;
	}

	const onSelectSupplierHandle = (e) =>{
		const target = e.target ? e.target : null;
		let newStruct = {...struct};
		let newValue = target ? target.value : e;
		newValue = parseInt(newValue);

		if(newValue < 0){
			const poster_suid = parseInt(struct.poster_suid);
			if(poster_suid > 0){
				newStruct.supplier = poster_suid;
				newStruct.supplier_info = "poster"
			} else {
				newStruct.supplier = newValue;
				newStruct.supplier_info = newValue < 0 ? "unknown" : "s2i";
			}
		} else {
			newStruct.supplier = newValue;
			newStruct.supplier_info = newValue < 0 ? "unknown" : "s2i";
		}

		newStruct.usage = 1;
		setState(newStruct);
		setChanget(true);
		if(props.onChange){
			props.onChange(newStruct);
		}
	}

	React.useEffect(()=>{
		// if (struct.cost === '' || parseFloat(struct.cost) < 0){
		// 	if (struct.poster_cost === '' || parseFloat(struct.poster_cost) > 0){
		// 		onChangeCostHandle(parseFloat(struct.poster_cost).toFixed(2));
		// 	}
		// } else {
		// 	onChangeCostHandle(parseFloat(struct.cost).toFixed(2));
		// }

		// if (struct.min_left === '' || parseFloat(struct.min_left) < 0) {
		// 	if (struct.poster_min_left === '' || parseFloat(struct.poster_min_left) > 0) {
		// 		onChangeMinHandle(parseFloat(struct.poster_min_left).toFixed(getUnitStr(struct.unit).scope));
		// 	}
		// } else {
		// 	onChangeMinHandle(parseFloat(struct.min_left).toFixed(getUnitStr(struct.unit).scope));
		// }

		// if (struct.max_left !== '' && parseFloat(struct.max_left) >= 0) {
		// 	onChangeMaxHandle(parseFloat(struct.max_left).toFixed(getUnitStr(struct.unit).scope));
		// }
		// if (struct.amount !== '' && parseFloat(struct.amount) >= 0) {
		// 	onChangeAmountHandle(parseFloat(struct.amount).toFixed(getUnitStr(struct.unit).scope));
		// }
	})

	const onChangeMaxHandle = (e) => {
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		try {
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0) {
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
			}

			newStruct.max_left = newValue;
			if(target){
				newStruct.max_left_info = "s2i";
				newStruct.usage = 1;
				if (props.onChange) {
					props.onChange(newStruct);
				}
			}
			setChanget(true);
			setState(newStruct);

		} catch {
			return
		}
	}

	const onChangeAmountHandle = (e) => {
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		try {
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0) {
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
			}

			newStruct.amount = newValue;
			if (target) {
				newStruct.amount_info = "s2i";
				newStruct.usage = 1;
				if (props.onChange) {
					props.onChange(newStruct);
				}
			}
			setChanget(true);
			setState(newStruct);

		} catch {
			return
		}
	}
	const onChangeMinHandle = (e) =>{
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		try {
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0) {
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
			}
			const poster_min_left = parseFloat(struct.poster_min_left);
			if (!target || newValue === "") {
				newStruct.min_left_info = poster_min_left > 0 ? "poster" : 's2i';
				newStruct.min_left = poster_min_left > 0 ? poster_min_left : newValue;
			} else {
				newStruct.min_left_info = 's2i';
				newStruct.min_left = newValue;
			}
			if(target){
				newStruct.usage = 1;
				if (props.onChange) {
					props.onChange(newStruct);
				}
			}
			setChanget(true);
			setState(newStruct);
		} catch {
			return
		}
	}

	const onChangeCostHandle = (e) =>{
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		try {
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0) {
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
				if (isNaN(newValue)) return;
			}
			if(!target){
				newStruct.cost_info = struct.poster_cost > 0 ? "poster" : 's2i';
				newStruct.cost = struct.poster_cost > 0 ? struct.poster_cost : newValue;
			} else {
				if(newValue === ""){
					newStruct.cost_info = struct.poster_cost > 0 ? "poster" : 's2i';
					newStruct.cost = struct.poster_cost > 0 ? struct.poster_cost : newValue;
				} else {
					newStruct.cost_info = 's2i';
					newStruct.cost = newValue;
				}
			}
			if(target){
				newStruct.usage = 1;
				if (props.onChange) {
					props.onChange(newStruct);
				}

			}
			setChanget(true);
			setState(newStruct);

		} catch {
			return
		}
	}

	const onChangeInputHandle = (e) =>{
		const target = e.target;
		let newStruct = { ...struct };
		let newValue = e.target.value;
		try{
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0){
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
				if(isNaN(newValue)) return;
			}
			let change = false;
			if(target.name === "max"){
				newStruct.max_left = newValue;
				newStruct.max_left_info = "s2i";
				change = true;
			}
			if (target.name === "amount") {
				newStruct.amount = newValue;
				newStruct.amount_info = "s2i";
				change = true;
			}
			if(change){
				if(props.onChange){
					props.onChange(newStruct);
				}
				newStruct.usage = 1;
				setChanget(true);
				setState(newStruct);
			}
		} catch {
			return
		}
	}
		
	const getTitle = (info) =>{
		if(info === "poster"){
			return "Задано в Poster";
		}
		if(info === "s2i"){
			return "Задано в общих настройках склада";
		}
		if(info === "sh2i"){
			return "Задано в настройках щаблона";
		}
		if (info === "unknown") {
			return "Значение ни где не определено";
		}
		return info;
	}

	const onChangeUsageHandle =(e) =>{
		let newValue = {...struct};
		let target = e.target;
		let newUsage = target ? (target.checked ? 1 : 0) : (e === true ? 1 : 0);

		newValue.usage = newUsage;
		if(props.onChange){
			props.onChange(newValue);
		}
		setChanget(true);
		setState(newValue);
	}

	const validNumber = (num) =>{
		return (!isNaN(parseFloat(num/num)) && num > 0) 
	}

	const getValidate = () =>{
		if(struct.usage !== 0){
			if(parseInt(struct.supplier) < 0){
				return { res: -1, info: "Не выбран поставщик заказа"}
			}
			if(!validNumber(struct.cost)){
				return {res: -1, imfo: "Не пределена цена для заказа"}
			}

			if(validNumber(struct.amount)){
				return {res: 1, info: "Ok"};
			} 

			if(validNumber(struct.min_left) && validNumber(struct.max_left)){
				if (parseFloat(struct.min_left) > parseFloat(struct.max_left)) {
					return { res: -1, info: "Минимум больше максимума..." }
				}
			}
			if (validNumber(struct.min_left)) {
				return { res: 1, info: "Ok" };
			}
			if(validNumber(struct.max_left)){
				return { res: 1, info: "Ok" };
			}
			return {res: -1, info: "Нет мининума или максимума"}
		}
		return { res: 0, info: "Заказ не отмечен для авто формирования" }; 
	}
	
	// const getValueImage = () =>{
	// 	const v = getValidate();
	// 	if(v.res < 0){
	// 		return (<SentimentDissatisfiedTwoToneIcon color="error" titleAccess={v.info}/>)
	// 	} else if(v.res > 0){
	// 		return (<SentimentSatisfiedTwoToneIcon color="primary" titleAccess={v.info} />)
	// 	}
	// 	return (<DeleteOutlineIcon color="disabled" titleAccess={v.info} />)
	// }

	const getSelectColor = () => {
		if (struct.supplier < 0) {
			return { color: "#c70404" };
		}
		if (struct.supplier_info === "poster") {
			return { color: "#3f51b5" }
		}
		if (struct.supplier_info === "s2i") {
			return { color: "black" }
		}
		return {}
	}

	const clearSelectHandle = ()=>{
		onSelectSupplierHandle(-1)
	}

	const getDeleteImage = () => {
		let disabled = true;
		// let value = struct.supplier;
		if (struct.supplier < 0) {
			if (s2i_suid > 0) {
				// value = s2i_suid;
				disabled = false;
			} else {
				if (poster_suid > 0) {
					// value = poster_suid;
					disabled = false;
				}
			}
		}
		return <MoreTwoToneIcon disabled={disabled} onClick={clearSelectHandle} />
	}

	const onStore = () => {
		if (props.onStore) {
			props.onStore(struct);
		}
	}

	const getValueImage = () => {
		const v = getValidate();
		if (v.res < 0) {
			return (<SentimentDissatisfiedTwoToneIcon color="error" titleAccess={v.info} />)
		} else if (v.res > 0) {
			return (<Button
				id={struct.iid}
				disabled={!changet}
				variant="contained"
				color="primary"
				size="small"
				className={classes.button}
				onClick={onStore}
				startIcon={<SentimentSatisfiedTwoToneIcon />}
			>
				Save
			</Button>)
		}
		return (<DeleteTwoToneIcon color="disabled" titleAccess={v.info} />)
	}

	return (
		<Grid container className={classes.root} direction="row"
			justify="flex-end"
			alignItems="center">
			<Grid className={classes.item} item xs={1}><Checkbox checked={struct.usage !== 0} name="select" 
				onChange={onChangeUsageHandle} /></Grid>
			<Grid className={classes.item} item xs={4}><Typography variant="body2">{struct.name}</Typography></Grid>
			<Grid className={classes.item} item xs={4}>
				<Tooltip title={getTitle(struct.supplier_info)}>
				<FormControl style={{ minWidth: "100%", maxWidth: "100%"}}>
					<Select
						style={getSelectColor()}
						autoWidth={false}
						labelid="supplierSelect"
						onChange={onSelectSupplierHandle}
						value={struct.supplier}
						displayEmpty
						title={getTitle(struct.suid_info)}
					>{getSuppliersOptions()}
					</Select>
				</FormControl>
				</Tooltip>
			</Grid>
			<Grid item xs={1}>{getDeleteImage()}</Grid>
			<Grid item xs={2}>{getValueImage()}</Grid>
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input value={struct.min_left} name="min" type="text" placeholder={struct.min_left_info}
					onChange={onChangeMinHandle} 
					endAdornment={<InputAdornment position="end" className="unit">{getUnitStr(unit).unit}</InputAdornment>}					
					title={getTitle(struct.min_left_info)}
						className={struct.min_left_info === "poster" ? classes.posterCost : classes.s2iCost}
					/>
					<FormHelperText>Минимальный остаток</FormHelperText>
				</FormControl>
			</Grid>
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input value={struct.max_left} name="max" type="text" placeholder="Макс. остаток"
					onChange={onChangeMaxHandle}
					endAdornment={<InputAdornment position="end" className="unit">{getUnitStr().unit}</InputAdornment>}
					title={getTitle(struct.max_left_info)}/>
					<FormHelperText>Максимальный остаток</FormHelperText>
				</FormControl>
			</Grid >
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input value={struct.cost} name="cost" type="text" placeholder={'Цена заказа'}
					onChange={onChangeCostHandle}
					endAdornment={<InputAdornment position="end" className="unit">р.</InputAdornment>}
					title={ getTitle(struct.cost_info) }
					className={struct.cost_info === "poster" ? classes.posterCost : classes.s2iCost}
					/>
					<FormHelperText>Цена заказа</FormHelperText>
				</FormControl>
			</Grid >
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input className="unit" value={struct.amount} name="amount" type="text" placeholder="Кол-во"
					onChange={onChangeAmountHandle}
					endAdornment={<InputAdornment disableTypography="true" position="end" className="unit">{getUnitStr().unit}</InputAdornment>}
					// inputProps={{ 'pattern': '[0-9.]' }}
					// style={{ "font-size": "0.7rem" }}
					title={getTitle(struct.amount_info)} />
					<FormHelperText>Кол-во для заказа</FormHelperText>
				</FormControl>
				</Grid >
		</Grid>
	);
// }
}

// export default StorageSupplyIngredientComponent;