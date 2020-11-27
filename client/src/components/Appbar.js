import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppTitleContainer from '../containers/AppTitleContainer'
import { makeStyles } from '@material-ui/core/styles';

// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export default function ButtonAppBar(props) {
//	const { classes } = props;
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<AppBar position="static" color="inherit">
				<Toolbar>
					{/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
						<MenuIcon />
					</IconButton> */}
					<AppTitleContainer className={classes.menuButton} />
					{/* <Typography variant="title" color="inherit" className={classes.flex}>
						Title
          			</Typography> */}
					<Button color="inherit" disabled={true}>Login</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}

ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

