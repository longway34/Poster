import React, { Component } from 'react';
import { findObjectByName } from '../store/constants'
import { useEffect } from 'react';
import { getUnitStr } from '../store/constants'

// import FormGroup from '@material-ui/core/FormGroup'
import Typography from '@material-ui/core/Typography'
import { Checkbox, Button, Input, Select, MenuItem, Grid, FormControl, InputAdornment, Tooltip , FormHelperText, IconButton } from '@material-ui/core';
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
	posterInput:{
		// fontSize: "0.8rem",
		color: "#3f51b5"
	},
	s2iInput:{
		// fontSize: "0.8rem",
		color: "#800202"
	},
	sh2iInput:{
//		color: "black"
	}
}))

export default function ShablonIngredientComponent(props){
	const classes = useStyles();

		let tempStateIngredient = {};

	const str = props.struct ? props.struct : tempStateIngredient;
	const suppliers = props.suppliers ? props.suppliers : {};
	const unit = str.unit;

	const max_left = parseFloat(str.max_left);
	const s2i_max_left = parseFloat(str.s2i_max_left);

	if (String(str.max_left).length === 0 || max_left < 0) {
		str.max_left = "";
	} else {
		str.max_left = parseFloat(str.max_left).toFixed(getUnitStr(unit).scope);
	};

	const min_left = parseFloat(str.min_left);
	const poster_min_left = parseFloat(str.poster_min_left);
	const s2i_min_left = parseFloat(str.s2i_min_left);

	if (String(str.min_left).length === 0 || min_left < 0) {
		str.min_left = "";
	} else {
		str.min_left = min_left.toFixed(getUnitStr(unit).scope);
	};

	const cost = parseFloat(str.cost);
	const poster_cost = parseFloat(str.poster_cost);
	const s2i_cost = parseFloat(str.s2i_cost);
	if (String(str.cost).length === 0 || cost < 0) {
		str.cost = "";
	} else {
		str.cost = cost.toFixed(2);
	}

	const amount = parseFloat(str.amount);
	const s2i_amount = parseFloat(str.s2i_amount);
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

	const onSelectSupplierHandle = (e) => {
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		newValue = parseInt(newValue);

		if (newValue < 0) {
			if(s2i_suid > 0){
				newStruct.supplier = s2i_suid;
				newStruct.supplier_info = 's2i';
			} else {
				// const poster_suid = parseInt(struct.poster_suid);
				if (poster_suid > 0) {
					newStruct.supplier = poster_suid;
					newStruct.supplier_info = "poster"
				} else {
					newStruct.supplier = newValue;
					newStruct.supplier_info = newValue < 0 ? "unknown" : "sh2i";
				}
			}
		} else {
			newStruct.supplier = newValue;
			newStruct.supplier_info = newValue < 0 ? "unknown" : "sh2i";
		}
		newStruct.usage = 1;

		setState(newStruct);
		setChanget(true);
		if (props.onChange) {
			props.onChange(newStruct);
		}
	}

	React.useEffect(()=>{
		// if (struct.cost === '' || parseFloat(struct.cost) < 0){
		// 	const poster_cost = parseFloat(struct.poster_cost);
		// 	const s2i_cost = parseFloat(struct.s2i_cost);
		// 	if (!isNaN(s2i_cost) && s2i_cost > 0){
		// 		onChangeCostHandle(String(s2i_cost));
		// 	} else if(!isNaN(poster_cost) && poster_cost > 0){
		// 		onChangeCostHandle(String(poster_cost));
		// 	}
		// }
		// if (struct.min_left === '' || parseFloat(struct.min_left) < 0) {
		// 	const poster_min_left = parseFloat(struct.poster_min_left);
		// 	const s2i_min_left = parseFloat(struct.s2i_cost);

		// 	if (!isNaN(s2i_min_left) && s2i_min_left > 0) {
		// 		onChangeMinHandle(String(s2i_min_left));
		// 	} else if(!isNaN(poster_min_left) && poster_min_left > 0){
		// 		onChangeMinHandle(String(poster_min_left));
		// 	}
		// }
		// if (struct.max_left === '' || parseFloat(struct.max_left) < 0) {
		// 	const s2i_max_left = parseFloat(struct.s2i_max_left);
		// 	if (!isNaN(s2i_max_left) && s2i_max_left > 0) {
		// 		onChangeMaxHandle(String(s2i_max_left));
		// 	}
		// }
		// if (struct.amount === '' || parseFloat(struct.amount) < 0) {
		// 	const s2i_amount = parseFloat(struct.s2i_amount);
		// 	if (!isNaN(s2i_amount) && s2i_amount > 0) {
		// 		onChangeAmountHandle(String(s2i_amount));
		// 	}
		// }
	})

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
				if (isNaN(newValue)) return;
			}
			if (!target || newValue === "") {
				newStruct.min_left_info = s2i_min_left > 0 ? "s2i" : poster_min_left > 0 ? 'poster': 'sh2i';
				newStruct.min_left = s2i_min_left > 0 ? s2i_min_left : poster_min_left > 0 ? poster_min_left : newValue;
			} else {
				newStruct.min_left_info = 'sh2i';
				newStruct.min_left = newValue;
			}

			if(target){
				newStruct.usage = 1;
				setState(newStruct);
				setChanget(true);
				if (props.onChange) {
					props.onChange(newStruct);
				}
			}
		} catch {
			return
		}
	}

	const onChangeCostHandle = (e) =>{
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? String(target.value) : String(e);
		try {
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0) {
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
				if (isNaN(newValue)) return;
			}
			if (!target || newValue === ""){
				newStruct.cost_info = s2i_cost > 0 ? 's2i' : poster_cost > 0 ? "poster" : "sh2i";
				newStruct.cost = s2i_cost > 0 ? s2i_cost : poster_cost > 0 ? poster_cost : newValue;
			} else {
				newStruct.cost_info = 'sh2i';
				newStruct.cost = newValue;
			}

			if(target){
				newStruct.usage = 1;
				setState(newStruct);
				setChanget(true);
				if (props.onChange) {
					props.onChange(newStruct);
				}
			}
		} catch {
			return
		}
	}

	const onChangeMaxHandle = (e) =>{
		const target = e.target ? e.target : null;
		let newStruct = { ...struct };
		let newValue = target ? target.value : e;
		try{
			newValue = newValue.replace(',', '.');
			if (newValue.length > 0){
				if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
					return;
				}
				if(isNaN(newValue)) return;
			}
			if(!target || newValue ===""){
				newStruct.max_left_info = s2i_max_left > 0 ? "s2i" : 'sh2i';
				newStruct.max_left = s2i_max_left > 0 ? s2i_max_left : newValue;
			} else {
				newStruct.max_left = newValue;
				newStruct.max_left_info = 'sh2i';
			}

			if(target){
				newStruct.usage = 1;
				setState(newStruct);
				setChanget(true);
				if(props.onChange){
					props.onChange(newStruct);
				}
			}
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
			if (isNaN(newValue / parseFloat(newValue) === 0 ? 1 : newValue)) {
				if (isNaN(newValue / newValue)) {
					return;
				}
				if (isNaN(newValue)) return;
			}
			// let change = false;
			// const s2i_amount = parseFloat(struct.s2i_amount);
			if (!target || newValue === "") {
				newStruct.amount_info = s2i_amount > 0 ? "s2i" : 'sh2i';
				newStruct.amount = s2i_amount > 0 ? s2i_amount : newValue;
				// change = true;
			} else {
				newStruct.amount = newValue;
				newStruct.amount_info = 'sh2i';
			}

			if (target) {
				newStruct.usage = 1;
				setState(newStruct);
				setChanget(true);
				if (props.onChange) {
					props.onChange(newStruct);
				}
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
		if(['sh2i', 'shablon'].indexOf(info) >= 0){
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
		setState(newValue);
		setChanget(true);
	}

	const validNumber = (num) =>{
		return (!isNaN(parseFloat(num/parseFloat(num) === 0 ? 1 : num)) && num > 0) 
	}

	const getValidate = () => {
		if (struct.usage !== 0) {
			if (parseInt(struct.supplier) < 0) {
				return { res: -1, info: "Не выбран поставщик заказа" }
			}
			if (!validNumber(struct.cost)) {
				return { res: -1, imfo: "Не пределена цена для заказа" }
			}

			if (validNumber(struct.amount)) {
				return { res: 1, info: "Ok" };
			}

			if (validNumber(struct.min_left) && validNumber(struct.max_left)) {
				if (parseFloat(struct.min_left) > parseFloat(struct.max_left)) {
					return { res: -1, info: "Минимум больше максимума..." }
				}
			}
			if (validNumber(struct.min_left)) {
				return { res: 1, info: "Ok" };
			}
			if (validNumber(struct.max_left)) {
				return { res: 1, info: "Ok" };
			}
			return { res: -1, info: "Нет мининума или максимума" }
		}
		return { res: 0, info: "Заказ не отмечен для авто формирования" };
	}	
	const getValueImage = () =>{
		const v = getValidate();
		if(v.res < 0){
			return (<SentimentDissatisfiedTwoToneIcon color="error" titleAccess={v.info}/>)
		} else if(v.res > 0){
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

	const clearSelectHandle = () => {
		onSelectSupplierHandle(-1)
	}
	const onStore = () => {
		if (props.onStore) {
			props.onStore(struct);
		}
	}

	const getDeleteImage = () =>{
		let disabled = true;
		// let value = struct.supplier;
		if(struct.supplier < 0){
			if(s2i_suid > 0){
				// value = s2i_suid;
				disabled = false;
			} else {
				if(poster_suid > 0){
					// value = poster_suid;
					disabled = false;
				}
			}
		}
		return <MoreTwoToneIcon disabled={disabled} onClick={clearSelectHandle}/> 
	}

	const getSelectColor = () => {
		if (struct.supplier < 0) {
			return { color: "#c70404" };
		}
		if (struct.supplier_info === "poster") {
			return { color: "#3f51b5" }
		}
		if (struct.supplier_info === "s2i") {
			return { color: "#3f51b5" }
		}
		return {}
	}

	const getInputCN =(info) =>{
		if(info === 'poster'){
			return classes.posterInput;
		}
		if(info === 's2i'){
			return classes.s2iInput;
		}
		return classes.sh2iInput;
	}
	return (
		<Grid container className={classes.root} direction="row"
			justify="left"
			alignItems="center">
			<Grid className={classes.item} item xs={1}><Checkbox checked={struct.usage !== 0} name="select" 
				onChange={onChangeUsageHandle} /></Grid>
			<Grid className={classes.item} item xs={4}><Typography variant="body2">{struct.name}</Typography></Grid>
			<Grid className={classes.item} item xs={4}>
				<Tooltip title={getTitle(struct.supplier_info)}>
				<FormControl style={{ minWidth: "100%", maxWidth: "100%" }}>
					{/* <InputLabel id="supplierSelect">Поставщик</InputLabel> */}
					<Select
						style={getSelectColor()}
						autoWidth="false"
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
					endAdornment={<InputAdornment position="end" className="unit">{getUnitStr().unit}</InputAdornment>}					
//					inputProps={{ 'step': `${getUnitStr().step}`, 'min': 0 }}
					// style={{ "font-size": "0.7rem" }}
					title={getTitle(struct.min_left_info)}
					className={getInputCN(struct.min_left_info)}
					/>
					<FormHelperText>Минимальный остаток</FormHelperText>
				</FormControl>
			</Grid>
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input value={struct.max_left} name="max" type="text" placeholder="Макс. остаток"
					onChange={onChangeMaxHandle}
					endAdornment={<InputAdornment position="end" className="unit">{getUnitStr().unit}</InputAdornment>}
//					inputProps={{'step': `${getUnitStr().step}`, 'min': 0}}
					// style={{ "font-size": "0.7rem" }}
					className={getInputCN(struct.max_left_info)}
					title={getTitle(struct.max_left_info)}/>
					<FormHelperText>Максимальный остаток</FormHelperText>
				</FormControl>
			</Grid >
			<Grid className={classes.item} item xs={3}>
				<FormControl>
				<Input value={struct.cost} name="cost" type="text" placeholder={struct.cost_info}
					onChange={onChangeCostHandle}
					endAdornment={<InputAdornment disableTypography="true" position="end" className="unit">р.</InputAdornment>}
					// inputProps={{ 'pattern': '[0-9.]' }}
					// style={{ "font-size": "0.7rem" }}
					title={ getTitle(struct.cost_info) }
					className={getInputCN(struct.cost_info)}
					/>
					<FormHelperText>Цена заказа</FormHelperText>
				</FormControl>
			</Grid >
			<Grid className={classes.item} item xs={3}>
				{/* <TextField className="unit" value={struct.amount} id="amount" type="text" placeholder="Кол-во" label="Кол-во заказа" */}
				<FormControl>
				<Input value={struct.amount} name="amount" type="text" placeholder="Кол-во"
					onChange={onChangeAmountHandle}
					endAdornment={<InputAdornment disableTypography="true" position="end" >{getUnitStr().unit}</InputAdornment>}
					// inputProps={{ 'pattern': '[0-9.]' }}
					// style={{ "font-size": "0.7rem" }}
					className={getInputCN(struct.amount_info)}
					title={getTitle(struct.amount_info)} />
					<FormHelperText>Кол-во для заказа</FormHelperText>
				</FormControl>
				</Grid >
		</Grid>
	);
// }
}

// export default StorageSupplyIngredientComponent;