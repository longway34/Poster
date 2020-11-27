import React from 'react';
import { useEffect } from 'react';
import clsx from 'clsx';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { findObjectByName } from '../store/constants';
import { Grid, Typography, Checkbox, FormControl, Select, MenuItem, 
	Card, Collapse, CardContent, IconButton, FormHelperText} from '@material-ui/core';
import CodeTwoToneIcon from '@material-ui/icons/CodeTwoTone';
import StorageIngredientComponent from './StorageIngredientComponent';
import ShablonIngredientComponent from './ShablonIngredientComponent';
	// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
	// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
	// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import StorageIngredientContainer from '../containers/StorageIngredientContainer';

const defaultStruct = {
	name: "", supplier: -1, usage: false
};
const tempSuppliers = require('./test_suppliers.json');

const theme = createMuiTheme({
	overrides: {
		// Style sheet name ⚛️
		MuiCardContent: {
			// Name of the rule
			// body1: {
			// 	// Some CSS
			// 	fontSize: 12
			// },
			root:{
				padding: 0,
				borderBottom: "solid 1px",
				'&:last-child': {
					paddingBottom: 3
				},

			}
		},
		MuiCollapse: {
			wrapperInner: {
				paddingLeft: '+25px'
			}
		},
		MuiFormControlLabel: {
		}
	},
});

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		padding: 0,
		marginRight: 10,
		color: "#ce0707",
		// fontWeight: "bold",
		// fontStyle: "italic"
	},
	item: {
		padding: 3
	},
  	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}))

export default function ProductCategoryComponent(props){
	const classes = useStyles();

	const str = props.struct ? props.struct : defaultStruct;
	const suppliers = props.suppliers ? props.suppliers : {};

	str.usage = props.selected ? props.selected : str.usage;
	str.supplier = props.supplier ? props.supplier : str.supplier;

	const typePage = props.typePage ? props.typePage : 'storage';

	const [struct, setState] = React.useState(str);
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const onChangeInputHandle = (e)=>{
		const newStruct = {...struct}
		const target = e.target;
		const newValue = target ? (target.checked ? 1: 0) : e;

		newStruct.usage = newValue ? 1 : 0;
		if(props.onChange){
			props.onChange(newStruct);
		}
		setState(newStruct);
	}

	const onSelectSupplierHandle = (e) => {
		const newStruct = {...struct};
		const target = e.target;
		const newValue = target ? target.value : e;

		newStruct.supplier = parseInt(newValue);
		if(props.onChange){
			props.onChange(newStruct);
		}
		onChangeInputHandle(true);
		setState(newStruct);
	}

	const getTitle = (info) => {
		if (info === "poster") {
			return "Задано в Poster";
		}
		if (info === "s2i") {
			return "Задано в общих настройках склада";
		}
		if (info === "sh2i") {
			return "Задано в настройках щаблона";
		}
		if (info === "unknown") {
			return "Значение ни где не определено";
		}
		return info;
	}

	const getSuppliersOptions = () => {
		let ret = [];
		ret.push(
			<MenuItem value={-1} disabled>Выберите поставщика катеории</MenuItem>
		)
		const keys = Object.keys(suppliers);
		for (let i = 0; i < keys.length; i++) {
			let supplier = suppliers[keys[i]];
			ret.push(
				<MenuItem value={supplier.id}>{supplier.name}</MenuItem>
			)
		}
		return ret;
	}

	const getChilds =() =>{
		const chKeys = Object.keys(struct.childs);
		let ret = [];
		for(let i=0; i<chKeys.length; i++){
			const childStr = struct.childs[chKeys[i]];
			if(["product", "ingredient"].indexOf(childStr.type) >= 0 ){
				if (typePage === "storage") {
					ret.push(
						<StorageIngredientComponent struct={childStr} onChange={props.onChange} suppliers={suppliers} onStore={props.onStore}/>
					)
				} else {
					ret.push(
						<ShablonIngredientComponent struct={childStr} onChange={props.onChange} suppliers={suppliers} onStore={props.onStore}/>
					)
				}
			} else if (["productsCategory", "ingredientsCategory"].indexOf(childStr.type) >=0){
				ret.push(
					<ProductCategoryComponent struct={childStr} suppliers={suppliers} onChange={props.onChange} typePage={typePage} onStore={props.onStore}/>
				)
			}
		}
		return ret;
	}

	const childs = getChilds();

	const expandButton = childs.length > 0 ? (
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
	) : (<CodeTwoToneIcon />)

	const getRP = (num) =>{
		num = parseInt(num);
		if(num % 10 === 1){
			return "продукт";
		}
		if(num < 10 || num > 20){
			if(num % 10 < 5){
				return "продукта"
			}
		}
		return "продуктов"
	}

	return (
	<ThemeProvider theme={theme}>
		<Card className="root">
			<CardContent> 
				<Grid container className={classes.root} direction="row"
					justify="space-around"
					alignItems="center">
					<Grid className={classes.item} item xs={1}>
						<Checkbox checked={struct.usage !== 0} name="select"
							onChange={onChangeInputHandle} 
								disabled={childs.length <= 0}
							/>
						</Grid>
					<Grid className={classes.item} item xs={4}>
						<FormControl>
							<Typography variant="body2">{struct.name}</Typography>
								<FormHelperText>{`${childs.length} ${getRP(childs.length)}`}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid className={classes.item} item xs={5}>
						<FormControl style={{ minWidth: "100%", maxWidth: "100%" }}>
							{/* <InputLabel id="supplierSelect">Поставщик</InputLabel> */}
							<Select
								disabled={childs.length <= 0}
								autoWidth="false"
								labelid="supplierSelect"
								onChange={onSelectSupplierHandle}
								value={struct.supplier ? struct.supplier : -1}
								displayEmpty
								title={getTitle(struct.suid_info)}
							>{getSuppliersOptions()}
							</Select>
						</FormControl>
					</Grid>
					<Grid className={classes.root} item xs={1}>
						{expandButton}
					</Grid>
				</Grid>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					{childs}
				</CardContent>
			</Collapse>
			{/* <CardActions disableSpacing>
			</CardActions> */}
		</Card> 
	</ThemeProvider>
	);
};

// export default StorageSupplyCategoryComponent;