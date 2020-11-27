import React from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { red } from '@material-ui/core/colors';

const theme = createMuiTheme({
	overrides: {
		// Style sheet name ⚛️
		MuiTypography: {
			// Name of the rule
			body1: {
				// Some CSS
				fontSize: 12
			},
		},
		PrivateSwitchBase: {
			root: {
				padding: 0
			}
		}
	},
});

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	formControl: {
		margin: theme.spacing(3),
	},
	red: {
		color: red[600],
		fontWeight: "bold"
	},
	bold: {
		fontWeight: "bold"
	}
}));

const outLabels = {
	monday: { id: "monday", title: "Понедельник", num: 1},
	tuesday: { id: "tuesday", title: "Вторник", num: 2},
	wednesday: { id: "wednesday", title: "Среда", num: 3},
	thursday: { id: "thursday", title: "Четверг", num: 4},
	friday: { id: "friday", title: "Пятница", num: 5},
	saturday: { id: "saturday", title: "Суббота", num: 6},
	sunday: { id: "sunday", title: "Воскресенье", num: 7},
}
const defaultDays = {days: [1, 3, 5]};

export default function ShedulerWeekPropertyComponent(props=defaultDays){
	const classes = useStyles();
	// const [state, setState] = React.useState({
	// 	monday: props.rows.indexOf(0) >=0,
	// 	tuesday: props.rows.indexOf(1) >= 0,
	// 	wednesday: props.rows.indexOf(2) >= 0,
	// 	thursday: props.rows.indexOf(3) >= 0,
	// 	friday: props.rows.indexOf(4) >= 0,
	// 	saturday: props.rows.indexOf(5) >= 0,
	// 	sunday: props.rows.indexOf(6) >= 0,
	// 	allDay: false,
	// 	workWeekDay: false,
	// });
	const [state, setState] = React.useState({
		monday: props.days ? props.days.indexOf(1) >= 0 : false,
		tuesday: props.days ? props.days.indexOf(2) >= 0 : false,
		wednesday: props.days ? props.days.indexOf(3) >= 0 : false,
		thursday: props.days ? props.days.indexOf(4) >= 0 : false,
		friday: props.days ? props.days.indexOf(5) >= 0 : false,
		saturday: props.days ? props.days.indexOf(6) >= 0 : false,
		sunday: props.days ? props.days.indexOf(0) >= 0 : false,
		allDay: false,
		workWeekDay: false,
	});

	
	const { sunday, monday, tuesday, wednesday, thursday, friday, saturday, workWeekDay } = state;

	const outDays = (state) =>{
		let ret = [];
		const keys = Object.keys(outLabels);
		for(let i=0; i<keys.length; i++){
			let el = outLabels[keys[i]];
			let val = state[el.id];
			if(val){
				ret.push(el.num);
			}
		}
		return ret;
	}

	const handleChange = (event) => {
		let newState = state;
		newState[event.target.name] = event.target.checked;
		if(!event.target.checked){
			newState = { ...newState, workWeekDay: false}
//			setState({...state, newState});
		}
//		let _d = outDays(newState); console.log(_d);
		setState({ ...state, ...newState });
		if(props.onChange){
			props.onChange(outDays(newState));
		}
	};

	const handleChangeWorkDays = (event) => {
		let newState = state;
		newState[event.target.name] = event.target.checked;
		if (event.target.checked) {
			newState = { ...newState, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false };
		}
		setState({ ...state, ...newState });
//		let _d = outDays(newState); console.log(_d);
		if (props.onChange) {
			props.onChange(outDays(newState));
		}
	};

	return (
		<div className={classes.root}>
			<ThemeProvider theme={theme}>
			<FormControl component="fieldset" className={classes.formControl}>
				{/* <FormLabel component="legend">Дни недели</FormLabel> */}
				<FormGroup>
					<FormControlLabel
						control={<Checkbox checked={monday} onChange={handleChange} name="monday" color='primary'/>}
						label="Понедельник"
					/>
					<FormControlLabel
						control={<Checkbox checked={tuesday} onChange={handleChange} name="tuesday" color='primary'/>}
						label="Вторник"
					/>
					<FormControlLabel
						control={<Checkbox checked={wednesday} onChange={handleChange} name="wednesday" color='primary'/>}
						label="Среда"
					/>
					<FormControlLabel
						control={<Checkbox checked={thursday} onChange={handleChange} name="thursday" color='primary'/>}
						label="Четверг"
					/>
				</FormGroup>
			</FormControl>
			<FormControl component="fieldset" className={classes.formControl}>
				{/* <FormLabel component="legend"><span>...</span></FormLabel> */}
				<FormGroup>
					<FormControlLabel
						control={<Checkbox checked={friday} onChange={handleChange} name="friday" color='primary'/>}
						label="Пятница"
					/>
					<FormControlLabel className={classes.red}
						control={<Checkbox checked={saturday} onChange={handleChange} name="saturday" />}
						label="Суббота"
					/>
					<FormControlLabel className={classes.red}
						control={<Checkbox checked={sunday} onChange={handleChange} name="sunday" />}
						label="Воскресенье"
					/>
					<FormControlLabel className={classes.bold}
						control={<Checkbox checked={workWeekDay} onChange={handleChangeWorkDays} name="workWeekDay" />}
						label="Рабочие дни"
					/>
				</FormGroup>
				{/* <FormHelperText>Отметьте нужные дни</FormHelperText> */}
			</FormControl>
			</ThemeProvider>
		</div>
	);
};

// ShedulerWeekPropertyComponent.propTypes = {
	
// };

//export default ShedulerWeekPropertyComponent;