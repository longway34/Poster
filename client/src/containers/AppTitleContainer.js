import React, { Component } from 'react';
import AppTitleComponent from '../components/AppTitleComponent'
import { connect } from 'react-redux'

class AppTitleContainer extends Component {
	render() {
		return (
			<AppTitleComponent settings={this.props.settings} />
		);
	}
}

const mapStateToProps = (state) =>{
	return {
		settings: state.settings
	}
}

export default connect(mapStateToProps)(AppTitleContainer);