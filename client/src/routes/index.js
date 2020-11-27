import React from "react";
import { Router, Route, Link } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import PropTypes from "prop-types";
import { withStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
// import Divider from "@material-ui/core/Divider";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
// import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
// import StarIcon from "@material-ui/icons/Star";
// import SendIcon from "@material-ui/icons/Send";

// import StoragesListContaines from '../containers/StoragesListContainer'
import StoragesListContainer from "../containers/StoragesListContainer";

// import MailIcon from "@material-ui/icons/Mail";
// import DeleteIcon from "@material-ui/icons/Delete";
// import ReportIcon from "@material-ui/icons/Report";

// import StoragesListContainer from "../containers/StoragesListContainer";
// import ShablonPropertyComponent from "../components/ShablonPropertyComponent";
import ShablonsListContainer from "../containers/ShablonsListContainer";
import StorageOrdersContainer from '../containers/StorageOrdersContainer';
import ShablonOrdersContainer from '../containers/ShablonOrdersContainer';

// import ShablonsListComponent from "../components/ShablonsListComponent";
// import Cards from "../pages/Cards";
// import Forms from "../pages/Forms";
// import Lists from "../pages/Lists";
// import Tables from "../pages/Tables";
// import Tabs from "../pages/Tabs";
// import Themes from "../pages/Themes";
// import Navigation from "../pages/Navigation";
// import GridList from "../pages/GridList.js";
// import Modal from "../pages/Modal.js";

import StorageIngredientsPageContainer from '../containers/StorageIngredientsPageContainer';
import ShablonIngredientsPageContainer from '../containers/ShablonIngredientsPageContainer';
// import SupplierPropertyComponent from '../components/SupplierPropertyComponent';
// import SupplierPropertyListComponent from '../components/SupplierPropertyListComponent';
import SupplierPropertyListContainer from '../containers/SupplierPropertyListContainer';

const drawerWidth = 330;

const theme = createMuiTheme({
	overrides: {
		// Style sheet name ⚛️
		MuiListItem: {
			// Name of the rule
			button: {
				paddingLeft: 6,
				paddingRight: 6
			},
		},
		MuiCardHeader:{
			root:{
				padding: 6
			}
		},
		MuiTypography:{
			h5: {
				fontSize: "0.875rem"
			},
			body1:{
				fontSize: "0.7rem"
			}
		}
	},
});

const styles = theme => ({
	MuiListItem:{
		button:{
			padding: 6,
		}
	},
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
		// padding: theme.spacing.unit * 3,
		padding: theme.spacing.unit,
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
						<ThemeProvider theme={theme}>
						<List>
							<ListItem button component={Link} to="/suppliersProperty">
								<ListItemIcon>
									<InboxIcon color="primary" />
								</ListItemIcon>
								<Typography variant="h6">Поставщики</Typography>
							</ListItem>
							<ListItem button component={Link} to="/">
								<ListItemIcon>
									<InboxIcon color="primary"/>
								</ListItemIcon>
									<StoragesListContainer />
							</ListItem>
							<ListItem button >
								<ShablonsListContainer />
							</ListItem>
						</List>
						</ThemeProvider>
					</Drawer>
					<main className={classes.content}>
						<Route exact path="/shablonIngredients" component={ShablonIngredientsPageContainer} />  
						<Route exact path="/storageIngredients" component={StorageIngredientsPageContainer} />  
						<Route exact path="/storageOrders" component={StorageOrdersContainer} />  
						<Route exact path="/shablonOrders" component={ShablonOrdersContainer} />  
						<Route exact path="/suppliersProperty" component={SupplierPropertyListContainer} />  

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
