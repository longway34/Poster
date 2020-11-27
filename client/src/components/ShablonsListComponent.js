import React, { Component } from 'react';
import { Router, Route, Link } from "react-router-dom";
import { Grid, Typography } from '@material-ui/core';
import ShablonPropertyComponent from './ShablonPropertyComponent';
import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import Typography from '@material-ui/core/Typography'
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import {myParseInt} from '../store/constants'
import { useConfirm } from 'material-ui-confirm';

const useStyles = makeStyles((theme) => ({
	root: {
		// maxWidth: 300,
		fontSize: 10,
		marginTop: 6
	},
}));

const tempShablons ={
	storage: 1,
	current: -1,
	rows:{
		0:{
			id: 0,
			name: "Первый шаблон",
			type: 0,
			time: "01:01",
			active: false,
			days: [1, 2, 3]
		},
		1: {
			id: 1,
			name: "Второй шаблон",
			type: 0,
			time: "02:02",
			active: true,
			days: [2, 3, 4]
		},
		2: {
			id: 2,
			name: "Третий шаблон",
			type: true,
			time: "03:03",
			active: false,
			days: [2, 23, 14]
		}
	}
}


export default function ShablonsListComponent(props){
	const [state, setState] = React.useState(
		props.shablons ? props.shablons : tempShablons,
	)
	const [storages, setStorage] = React.useState(
		props.storage ? props.storage : null
	)

	const onSelect = (shablon) =>{
		setState({...state, current: shablon.id});
		if(props.onSelect){
			props.onSelect(shablon.id)
		}
	}

	const onDelete = (id) => {
		if(props.onDelete){
			props.onDelete(id);
		}
	}

	const onChange = (shablon) =>{
		if(props.onChange){
			props.onChange(shablon);
		}
	}
	const onCommonSettingClickHandle = () =>{
		setState({ ...state, current: 0 });
		if (props.onSelect) {
			props.onSelect(0)
		}
	}

	const classes = useStyles();

	const getCommonSetting = (name="") =>{
		let ret = (
			<ListItem button component={Link} to="/storageIngredients">
				<Card className={classes.root}>
					<CardHeader titleTypographyProps={{variant: "h6"}}
						avatar={
							state.current === 0 ? <SettingsTwoToneIcon color="primary" /> : ""
						}
						title="Настройки для склада..."
						subheader ={name}
						onClick={onCommonSettingClickHandle} />
				</Card>
			</ListItem>
		);
		return [ret];
	}

	const getContent = () =>{
		let rows = (props && props.shablons && props.shablons.rows) ? props.shablons.rows : state.rows;
		rows = Array.isArray(rows) ? Object.assigs({}, rows) : rows;
		let storage = props.storage ? myParseInt(props.storage.id) : myParseInt(state.storage);
		const values = Object.values(rows);
		let ret = props.storage ? getCommonSetting(props.storage.name) : []; 
		let newShablonAddaded = false;
		// ret.push();
		for(let k=0; k<values.length; k++){
			const shablon = values[k];
			if(shablon && myParseInt(shablon.id) < 0) newShablonAddaded = true;
			ret.push(
				<ListItem button component={Link} to="/shablonIngredients">
					<ShablonPropertyComponent key={`spc_${shablon.id}`} shablon={shablon} 
					current={state.current} onSelect={onSelect} onChange={onChange} onDelete={onDelete} />					{/* <ListItemText primary="Home" /> */}
				</ListItem>


			)
		}
		if(!newShablonAddaded && storage >= 0){
			ret.push(
				<ListItem button component={Link} to="/shablonIngredients">
					<ShablonPropertyComponent shablon={null}
						current={state.current} onSelect={onSelect} onChange={onChange} />
				</ListItem>
			)
		}
		return ret;
	}

	return (
		<Grid container direction="column">
			{getContent()}
		</Grid>
	)
}
