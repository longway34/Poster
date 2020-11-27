import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import CardMedia from '@material-ui/core/CardMedia';
import ButtonBase from '@material-ui/core/ButtonBase';

//import './css/AppTitleComponent.css'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		// margin: 'auto',
		maxWidth: "90%",
		width: "90%"
	},
	image: {
		width: 64,
		height: 64,
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
}));


export default function AppTitleComponent(props) {
	const { settings } = props;

	const classes = useStyles();

	return (
		<Paper className={classes.paper}>
			<Grid container spacing={2} alignItems="flex-start">
				<Grid item>
					<ButtonBase className={classes.image}>
						<img src={settings.firmLogoUrl} className={classes.img} alt="Логотип конторы" />
					</ButtonBase>
				</Grid>
				<Grid item xs={12} sm container>
					<Grid item xs container direction="column" spacing={2}>
						<Grid item xs>
							<Typography variant="body2" component="p">
								{settings.firmType ? parseInt(settings.firmType) === 1 ? "Кафе" : "Магазин" : ""}
							</Typography>
							<Typography variant="h5" component="h2">
								{settings.firmName ? settings.firmName : ""}
							</Typography>
							<Typography variant="caption" component="p">
								{`${settings.firmAddress} (${settings.firmPhone},  ${settings.FirmEmail})`}
							</Typography>
							{/* <Typography variant="caption" component="p">
								{settings.firmPhone}
							</Typography>
							<Typography variant="body2" component="p">
								{settings.firmEmail}
							</Typography> */}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
}

