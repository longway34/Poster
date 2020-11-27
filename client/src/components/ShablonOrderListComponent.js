import React from 'react';
import { Card, CardHeader, Grid, Typography, Collapse, IconButton, CardContent, ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MySpinner from './MySpinner';
import StorageOrderView from './StorageOrderView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import EmailTwoToneIcon from '@material-ui/icons/EmailTwoTone';
// import { KeyboardArrowDown } from 'material-ui-icons';

const useStyles = makeStyles((theme) => ({
		root: {
			// maxWidth: 345,
			margin: "5px",
			paddingBottom: "5px"
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
	})
)

const StorageOrderListComponent = (props) => {
	const classes = useStyles();
	// const storages = props.storages ? props.storages : {};
	const [expanded, setExpanded] = React.useState({});

	const handleExpandClick = (e) => {
		let i = e.target.id;
		if(i && i.length>0){
			let index = parseInt(i);
			let newValue = expanded[index] ? !expanded[index] : true;
			let newExpanded = Object.assign({}, expanded, {[index]: newValue})
			setExpanded(newExpanded);
		}
		// setExpanded(!expanded);
	};


	const expandButton = (index)=>{
		return (
		<IconButton
			// className={clsx(classes.expand, {
			// 	[classes.expandOpen]: expanded,
			// })}
			onClick={handleExpandClick}
			id={index}
			// aria-expanded={expanded}
			// aria-label="show more"
			size="small"
		>
				{expanded[index] ? (<KeyboardArrowUpIcon id={index} />) : (<KeyboardArrowDownIcon id={index}/>)}
		</IconButton>
		)
	}

	const onSendClickHandle = (e) =>{
		if(props.onSend){
			let id = parseInt(e.currentTarget.id);
			let storage_id = sendButtonProperties[id] ? sendButtonProperties[id].storage_id : -1;
			let supplier_id = sendButtonProperties[id] ? sendButtonProperties[id].supplier_id : -1;
			let shablon_id = sendButtonProperties[id] ? sendButtonProperties[id].shablon_id : -1;
			props.onSend(storage_id, shablon_id, supplier_id);
		}
	}
	
	let sendButtonProperties = {};

	const getContent = ()=>{
		let ret = [];
		if (!props.listOrders || !props.listOrders.storages){
			return ret;
		}
		let count = 0;
		for (let [sid, storage] of Object.entries(props.listOrders.storages)){
			let storageName = props.storages.rows[parseInt(sid)].name;
			let storage_id = props.storages.rows[parseInt(sid)].id;
			let storage_poster_id = props.storages.rows[parseInt(sid)].poster_id;
			for(let [shid, shablon] of Object.entries(storage.shablons)){
				let shablonName = props.shablon ? props.shablon.name : '';
				let shablon_id = parseInt(shid);
				for(let [suid, supplier] of Object.entries(shablon.suppliers)){
					let supplierName = props.suppliers.rows[parseInt(suid)].name;
					let supplier_id = props.suppliers.rows[parseInt(suid)].id;
					let supplier_poster_id = props.suppliers.rows[parseInt(suid)].poster_id;
					let css = props.listOrders.css;
					for(let i = 0; i<supplier.htmls.length; i++){
						let html = supplier.htmls[i];
						let number = html.number;
						sendButtonProperties[count] = {
							storage_id: storage_id,
							storage_poster_id: storage_poster_id,
							supplier_id: supplier_id,
							supplier_poster_id: supplier_poster_id,
							shablon_id: shablon_id
						}
						ret.push(
							<Card name={i} variant="outlined" className={classes.root}>
								<CardContent>
									<Grid container direction="row">
										<Grid item xs={3}>
											<Typography>{storageName}</Typography>
										</Grid>
										<Grid item xs={4}>
											<Typography>{supplierName}</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography>{`(${shablonName} - ${number})`}</Typography>
										</Grid>
										<Grid className={classes.root} item xs={1}>
											{expandButton(count)}
										</Grid>
									</Grid>
									<Grid container direction="row" justify="flex-end">
										<ButtonGroup>
											<Button shablon_id={shablon_id}
												id={count}
												// supplier_id={supplier_id} supplier_poster_id={supplier_poster_id}
												// storege_id={storage_id} storage_poster_id={storage_poster_id}
												onClick={onSendClickHandle} size="small"
												color='primary'
												startIcon={<EmailTwoToneIcon variant={'primary'} />}
											>Send</Button>
										</ButtonGroup>
									</Grid>
								</CardContent>
								<Collapse in={expanded[count]} timeout="auto">
									<StorageOrderView html={html.data} css={css} isLoading={props.isWaiting ? props.isWaiting : false} />
								</Collapse>
							</Card>
						);
						count++;
					}
				}
			}
		}
		return ret;
	};


	return (
		<div>
		<MySpinner hidden={props.isWaiting ? !props.isWaiting : true} />
		{getContent()}
		</div>
	);
};

export default StorageOrderListComponent;