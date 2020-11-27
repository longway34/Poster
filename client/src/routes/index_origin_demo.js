import React from "react";
import { Router, Route, Link } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";
// import MailIcon from "@material-ui/icons/Mail";
// import DeleteIcon from "@material-ui/icons/Delete";
// import ReportIcon from "@material-ui/icons/Report";

// import Home from "../pages/Home";
// import Cards from "../pages/Cards";
// import Forms from "../pages/Forms";
// import Lists from "../pages/Lists";
// import Tables from "../pages/Tables";
// import Tabs from "../pages/Tabs";
// import Themes from "../pages/Themes";
// import Navigation from "../pages/Navigation";
// import GridList from "../pages/GridList.js";
// import Modal from "../pages/Modal.js";

const drawerWidth = 240;

const styles = theme => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: "hidden",
		position: "relative",
		display: "flex"
	},
	drawerPaper: {
		position: "relative",
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		minWidth: 0 // So the Typography noWrap works
	},
	toolbar: theme.mixins.toolbar
});

const history = createBrowserHistory();

const Routes = props => {
	const { classes } = props;

	return (
		<div>
			<Router history={history}>
				<div className={classes.root}>
					<Drawer
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						{/* <div className={classes.toolbar} /> */}
						<List>
							<ListItem button component={Link} to="/">
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary="Home" />
							</ListItem>
							<ListItem button component={Link} to="/tabs">
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary="Tabs" />
							</ListItem>
							<ListItem button component={Link} to="/cards">
								<ListItemIcon>
									<StarIcon />
								</ListItemIcon>
								<ListItemText primary="Cards" />
							</ListItem>
							<ListItem button component={Link} to="/navigation">
								<ListItemIcon>
									<StarIcon />
								</ListItemIcon>
								<ListItemText primary="Navigation" />
							</ListItem>
							<ListItem button component={Link} to="/gridlist">
								<ListItemIcon>
									<StarIcon />
								</ListItemIcon>
								<ListItemText primary="GridList" />
							</ListItem>
							<ListItem button component={Link} to="/forms">
								<ListItemIcon>
									<SendIcon />
								</ListItemIcon>
								<ListItemText primary="Forms" />
							</ListItem>
							<ListItem button component={Link} to="/lists">
								<ListItemIcon>
									<SendIcon />
								</ListItemIcon>
								<ListItemText primary="Lists" />
							</ListItem>
							<ListItem button component={Link} to="/modal">
								<ListItemIcon>
									<SendIcon />
								</ListItemIcon>
								<ListItemText primary="Modal" />
							</ListItem>
							<ListItem button component={Link} to="/tables">
								<ListItemIcon>
									<DraftsIcon />
								</ListItemIcon>
								<ListItemText primary="Tables" />
							</ListItem>
							<ListItem button component={Link} to="/themes">
								<ListItemIcon>
									<DraftsIcon />
								</ListItemIcon>
								<ListItemText primary="Themes" />
							</ListItem>
						</List>
					</Drawer>
					<main className={classes.content}>
						{/* <div className={classes.toolbar} /> */}
						<Route exact path="/" component={Home} />
						<Route path="/cards" component={Cards} />
						<Route path="/navigation" component={Navigation} />
						<Route path="/gridlist" component={GridList} />
						<Route path="/forms" component={Forms} />
						<Route path="/lists" component={Lists} />
						<Route path="/modal" component={Modal} />
						<Route path="/tables" component={Tables} />
						<Route path="/tabs" component={Tabs} />
						<Route path="/themes" component={Themes} />
					</main>
				</div>
			</Router>
		</div>
	);
};

Routes.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Routes);
