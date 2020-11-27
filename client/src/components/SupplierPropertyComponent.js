import React from 'react';
import { TextField, Card, Grid, CardContent, IconButton, Collapse, Select, FormControl, InputLabel, Input, Checkbox, Typography, FormHelperText, Button } from '@material-ui/core';
// import classes from '*.module.css';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
root: {
	maxWidth: "100%",
		padding: "3px",
		marginRight: 10,
				// color: "#ce0707",
		// fontWeight: "bold",
		// fontStyle: "italic"
	},
cardRoot:{
	marginBottom: "5px"
},
formControl: {
	width: "100%"
},
item: {
	padding: 3
},
collapseRoot:{
	paddingLeft: "5px",
	paddingBottom: "5px"
}
}))

const temp_supplier = {
	id: 3,
	sql_id: 3,
	name: "Валера",
	poster_id: 3,
	type_delivery_info: 0,
	address_delivery_info: "longway34@gmail.com",
	src:{
		supplier_id: "3",
		supplier_name: "Валера",
		supplier_phone: "380671234567",
		supplier_adress: "пр. Петровского",
		supplier_comment: "Мясо",
		supplier_code: "32855961",
		supplier_tin: "6449013711",
		delete: "0",
		sql_id: 3,
		poster_id: 3,
		address_delivery_info: "longway34@gmail.com",
		type_delivery_info: 0
	}

}

const SupplierPropertyComponent = (props) => {
	const classes = useStyles();

	const supplier = props.supplier ? props.supplier : temp_supplier;

	const [dAddress, setDAddress] = React.useState(supplier.address_delivery_info);
	const [dType, setDType] = React.useState(supplier.type_delivery_info);
	const [expanded, setExpanded] = React.useState(false);
	const [changet, setChanget] = React.useState(false);

	React.useEffect(()=>{
		if(parseInt(dType) === 2){
			setDAddress(normalizeInput(dAddress));
		}
	}, [dType, dAddress])

	const isAuto = ()=>{
		return dType >= 0;
	}

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const onChangeAutoEnabled = (e) =>{
		let tName = e.target.name;
		setChanget(true);
		if(tName === "autoOnOff"){
			let checked = e.target.checked;
			setDType(checked ? 0 : -1);
			if(checked){
				setExpanded(true);
			} else {
				setDAddress("");
			}
		} else if(tName === "typeDelivery"){
			let value = e.target.value;
			setDType(value);
		}
	}
	const expandButton = (
		<IconButton
			className={clsx(classes.expand, {
				[classes.expandOpen]: expanded,
			})}
			onClick={handleExpandClick}
			aria-expanded={expanded}
			aria-label="show more"
		>
			<ExpandMoreIcon />
		</IconButton>
	)
	const normalizeInput = (value, previousValue) => {
		// return nothing if no value
		if (!value) return value;

		// only allows 0-9 inputs
		let cv = value.replace(/[^\d]/g, '');
		if(cv.slice(0,1) === "7") cv = cv.slice(1);
//		const currentValue = value.replace(/[^\d]/g, '');
		const currentValue = cv;

		const cvLength = currentValue.length;

		if (!previousValue || value.length > previousValue.length) {

			// returns: "x", "xx", "xxx"
			if (cvLength < 4) return `+7 (${currentValue})`;

			// returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
			if (cvLength < 7) return `+7 (${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

			// returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
			return `+7 (${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 8)}-${currentValue.slice(8, 10)}`;
		}
	};

	const isValidateAddress = ()=>{
//		let parrent;
		let pattern = [0, 1].indexOf(parseInt(dType)) < 0 ? 
			/^\+[\d]{1}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/ :
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i;
		// let pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i;
		let result = pattern.test(String(dAddress).toLowerCase());
		return result;
	}

	const isValidatePhone = () =>{

		let pattern = /^\+[\d]{1}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/;
		// let pattern = /^[\+\d\(\)\ -]{4,20}$/;
		let result = pattern.test(String(dAddress).toLowerCase());
		return result;
		// return result;
	}

	const onChangeDeliveryAddress = (e) =>{
		let value = e.target.value;
		setDAddress(value);
		setChanget(true);
	}

	const onChangePhoneNumber = ({target: {value}}) =>{
		setDAddress(prevDAddress => (normalizeInput(value, prevDAddress)))
		setChanget(true);
	}

	const getInputAddressDelivery = () =>{
		if([0, 1].indexOf(parseInt(dType)) >= 0){ 
			return (
			<TextField id="inputEmail" error={!isValidateAddress()} 
				value={dAddress} 
				onChange={onChangeDeliveryAddress} 
				placeholder="Введите адрес электронной почты"
				disabled={!isAuto()}
				inputProps={{"size": 60}}
				label="Адрес доставки заказов"
			/>)
		} else {
			return (
			<TextField id="inputPhone" error={!isValidateAddress()} 
				value={dAddress} 
				onChange={onChangePhoneNumber} 
				placeholder="Номер тел-на (10 цифр)"
				disabled={!isAuto()}
				inputProps={{ "size": 60 }}
				label="Телефон доставки заказов"
			/>)
		}
	}

	const isDisabledUpdate = () =>{
		if(parseInt(dType) < 0){
			return !changet;
		}
		let result = !isValidateAddress() || !changet;
		return result;
	}

	const handleOnUpdate = () =>{
		if(props.onUpdate){
			props.onUpdate({
				id: supplier.id,
				type_delivery_info: dType,
				address_delivery_info: parseInt(dType) === 2 ? dAddress.replace(/[^\d]/g, '').slice(1) : dAddress
			})
		}
		setChanget(false);
	}

	return (
		<Card className={classes.cardRoot}>
			<CardContent className={classes.root}>
				<Grid container direction="row">
					<Grid className={classes.item} item xs={1}>
						<Checkbox checked={isAuto()} name="autoOnOff"
							onChange={onChangeAutoEnabled}
							disabled={!expanded}
						/>
					</Grid>
					<Grid className={classes.item} item xs={10}>
						<FormControl>
							<Typography variant="body2">{`${supplier.name} (${supplier.src.supplier_comment})`}</Typography>
							<FormHelperText>{`${supplier.name} (${supplier.src.supplier_adress} т.${supplier.src.supplier_phone})`}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid className={classes.item} item xs={1}>
						{expandButton}
					</Grid>
				</Grid>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit className={classes.collapseRoot}>
				<Grid container direction="column">
					<Grid container direction="row">
						<Grid className={classes.item} item xs={4}>
							Наименование
						</Grid>
						<Grid className={classes.item} item xs={8}>
							{supplier.name}
						</Grid>
					</Grid>
					<Grid container direction="row">
						<Grid className={classes.item} item xs={4}>
							ИНН/ОКПО
						</Grid>
						<Grid className={classes.item} item xs={8}>
							{`${supplier.src.supplier_tin}/${supplier.src.supplier_code}`}
						</Grid>
					</Grid>
					<Grid container direction="row" justify="space-between">
						<Grid className={classes.item} item xs={5}>
							<FormControl required className={classes.formControl}>
								<InputLabel htmlFor="age-native-required">Метод доставки заказов</InputLabel>
									<Select native
										value={dType}
										onChange={onChangeAutoEnabled}
										name="typeDelivery"
										disabled={!isAuto()}
									>
									<option value={-1} disabled={true} selected={parseInt(supplier.type_delivery_info) === -1}>Без доставки заказов</option>
									<option value={0} selected={parseInt(supplier.type_delivery_info) === 0}>Доставка заказов Email-HTML</option>
									<option value={1} selected={parseInt(supplier.type_delivery_info) === 1}>Доставка заказов Email-Excel</option>
									<option value={2} selected={parseInt(supplier.type_delivery_info) === 3} disabled>Доставка заказов Viber</option>
									</Select>
							</FormControl>
						</Grid>
						<Grid className={classes.item} item xs={5}>
							<FormControl required className={classes.formControl}>
								{getInputAddressDelivery()}
							</FormControl>
						</Grid>
						<Grid item xs={2}>
							<Button 
							disabled={isDisabledUpdate()} 
							onClick={handleOnUpdate}
							variant="contained"
							color="primary"
							size="small"
							startIcon={<SaveIcon />}
							>Save</Button>
						</Grid>
					</Grid>
				</Grid>
			</Collapse>
		</Card>
	);
};

export default SupplierPropertyComponent;