import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import shadows from '@material-ui/core/styles/shadows';
// import { MuiPickersUtilsProvider, KeyboardTimePicker} from '@material-ui/pickers';
import ShedulerWeekPropertyComponent from './ShedulerWeekPropertyComponent';
import ShedulerMonthPropertyComponent from './ShedulerMonthPropertyComponent';
import { Grid, Button, Checkbox, FormControl, FormGroup } from '@material-ui/core';
// import DateFnsUtils from "@date-io/date-fns";
// import EditLocationTwoToneIcon from '@material-ui/icons/EditLocationTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import { useConfirm } from 'material-ui-confirm'

const useStyles = makeStyles((theme) => ({
	// typography: {
	// 	// In Chinese and Japanese the characters are usually larger,
	// 	// so a smaller fontsize may be appropriate.
	// },
	root: {
		// maxWidth: 300,
		fontSize: 10,
		marginTop: 6
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
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
		wrapperInner:{
			paddingLeft: '10px'
		}
}));

const ShablonPropertyComponent = props => {
	const classes = useStyles();
	const shablon = props.shablon ? props.shablon : {
		id: -1,
		name: "",
		time: "00:00:00",
//		nextSupply: "...",
		type: 0, // week days
		active: false, // 0 - false; ather - true
		days: []
	}
	const [expanded, setExpanded] = React.useState(false);
	const [state, setState] = React.useState(shablon);
	const [current, setCurrent] = React.useState(props.current ? props.current : state.id);

		
	const handleExpandClick = () => {
		setExpanded(!expanded);
//		setSelected(!selected);
	};

	function daysInMonth(date) {
		return new Date(date.getYear(), date.getMonth()+1, 0).getDate();
	}

	const onChangeNameHandle = (e) => {
		let newState = Object.assign({}, state);
		newState.name = e.target.value;
		setState(newState);
	}

	const nameFiels = (<TextField variant="outlined" id="standard-basic" label="Название шаблона" value={state.name} disabled={!expanded} onChange={onChangeNameHandle}/>);

	const nextSupply = () =>{
		let ret = "..."; 
		
		if(state.days && state.days.length > 0){
			const daysWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
			let today = new Date(); let min = 365*24*60*60*1000; let minAddDay;
			let dayToday = state.type === 0 ? today.getDay() : today.getDate()-1; let lastDate;
			let numDaysInPeriod = state.type === 0 ? 7 : daysInMonth(today);
			for(let i=0; i<state.days.length; i++){
				let dn = state.days[i];
				let addDay = 0;
				let addHours = 0;
				let addMinutes = 0;
				if(dn < dayToday){
					addDay = numDaysInPeriod - (dayToday - dn);
				} else if(dn > dayToday){
					addDay = dn - dayToday;
				} else {
					let [nh, nm] = state.time.split(':');
					let [h, m] = [today.getHours(), today.getMinutes()];
					if(h > nh){
						addDay = numDaysInPeriod;
						addHours = 24 - (h - nh);
					} else if(nh > h){
						addHours = (nh - h);
					} else {
						if(m > nm){
							addDay = numDaysInPeriod;
							addMinutes = 60 - (m - nm);
						} else {
							addMinutes = nm - m;
						}
					}
				}
				let nextDate = new Date();
				if(addDay > 0) nextDate.setDate(nextDate.getDate()+addDay);
				if(addHours > 0) nextDate.setHours(nextDate.getHours()+addHours);
				if(addMinutes > 0) nextDate.setMinutes(nextDate.getMinutes()+addMinutes);

				let diff = nextDate - today;
				if(min > diff){
					min = diff;
					lastDate = nextDate;
					minAddDay = addDay;
				}
			}
			const myNum = (num) => {
				return parseInt(num) > 9 ? String(num) : `0${String(num)}`;
			}

			let nextDateString = minAddDay > 0 ? `${myNum(lastDate.getDate())}.${myNum(lastDate.getMonth() + 1)}(${daysWeek[lastDate.getDay()]})` : "сегодня";
			nextDateString += "в "+state.time;
			ret = `Сл. заказ ${nextDateString} ${state.active ? "" : "ОТКЛЮЧЕН"}`;
		}
		return ret;
	}

	const onChange = (days) =>{
		let newState = Object.assign({}, state);
		newState.days = days.slice();
		setState(newState);
	}

	const onChangeTimeHandle = (e) => {
		let newState = Object.assign({}, state);
		newState.time = e.target.value;
		setState(newState);
	}
	const onChangeTypeHandle = (e) => {
		let newState = Object.assign({}, state);
		newState.type = parseInt(e.target.value);
		setState(newState);
	}

	const onChangeActiveHandle = (e) => {
		let newState = Object.assign({}, state);
		newState.active = !newState.active;
		setState(newState);
	}
	const cancelClickHandle = () =>{
		setExpanded(false);
	}

	const okClickHandle = () => {
		if(props.onChange){
			props.onChange(state)
		}
	}

	const daysPanel = state.type === 0 ?
	(<ShedulerWeekPropertyComponent days={state.days} onChange={onChange} />) :
	(<ShedulerMonthPropertyComponent days={state.days} onChange={onChange} />)

	const onSelectHandle = () => {
//		console.debug("Выбрали элемент...");
		if(props.onSelect){
			props.onSelect(state);
		}
		if(isSelected()){
			handleExpandClick();
		}
//		setSelected(!selected);
	}

	const isSelected = () => {
		return props.current === state.id;
	}
	const iconSelected = () => {
		return isSelected() ? expanded ? <CreateTwoToneIcon color="primary"/> : 
			<SettingsTwoToneIcon color="primary"/> : "";
	}

	const confirm = useConfirm();

	const deleteClickHandle = () =>{
		confirm({title: "Внимание...", description: `Вы действительно хотите удалить шаблон ${state.name} ?`,
			dialogProps: { maxWidth: "xs"} })
		.then(() => {		
			if(props.onDelete){
				props.onDelete(state.id);
			}
		})
		.catch(()=>{})
	}
	
	return (
		<Card className={classes.root} >
			<CardHeader onClick={onSelectHandle} titleTypographyProps={{variant: "h6"}}
				avatar = {
					iconSelected()
				}
				title={(!state.name || state.name === "") ? "Новый шаблон..." : state.name}
				subheader={nextSupply()}
			/>
			{/* <CardActions disableSpacing>
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
			</CardActions> */}
			<Collapse in={expanded && (props.current === state.id)} timeout="auto" unmountOnExit classes={{ wrapperInner:classes.wrapperInner}}>
				<CardContent>
					<Grid container justify="flex-start">
						<Grid container xs={12} alignItems="center">
							<Grid item xs={8}>
								{nameFiels}
							</Grid>
							<Grid item xs={2}>
								<Input type="time" value={state.time} onChange={onChangeTimeHandle} />
								{/* <input required={true} key={`time_input`} type="time" id={`time_input`} value={state.time} onChange={onChangeTimeHandle} /> */}
								{/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardTimePicker
										margin="normal"
										id="time-picker"
										label="Time picker"
										value={state.time}
										onChange={onChangeTimeHandle}
										KeyboardButtonProps={{
											'aria-label': 'change time',
										}}
									/>
								</MuiPickersUtilsProvider> */}
							</Grid>
						</Grid>
						<Grid item xs={12} direction="row">
							<FormGroup row="true" >
								<RadioGroup row fullWidth={true} name="type" value={state.type} onChange={onChangeTypeHandle} orientation="horizontal">
									<FormControlLabel name="type" value={0} control={<Radio />} label="Неделя" />
									<FormControlLabel value={1} control={<Radio />} label="Месяц" />
								</RadioGroup>
								<FormControlLabel onClick={onChangeActiveHandle}
									control={<Checkbox checked={state.active} value={state.active}/>}
									label={state.active ? "Активен" : "Отключен"} />
							</FormGroup>
							{/* <Checkbox checked={state.active} label="Активен" onChange={onChangeActiveHandle} /> */}
						</Grid>
						<Grid item xs={12}>
							{daysPanel}
						</Grid>
						<Grid container xs={12} justify="flex-end">
							<Grid item xs={4}>
								<Button variant="contained" size={'small'} onClick={cancelClickHandle}>Cancel</Button>
							</Grid>
							<Grid item xs={4}>
								<Button variant="contained" size={'small'} color="primary" onClick={okClickHandle} 
									disabled={(Array.isArray(state.days) && state.days.length <= 0) || (String(state.name).length <=0)} >Ok</Button>
							</Grid>
							<Grid item xs={4}>
								<Button variant="contained" 
									onClick={deleteClickHandle} size={'small'} disabled={(state.id === -1) || !(props.onDelete)}>Delete</Button>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Collapse>
		</Card>
	);
};

ShablonPropertyComponent.propTypes = {
	
};

export default ShablonPropertyComponent;