import React, { Component } from 'react';
import Spinner from 'react-spinkit';

class MySpinner extends Component {
	render() {
		let hiddenStyle = {
			position: 'fixed',
//			backgroundColor: 'lightblue',
			transform: 'left 1.5s'
		}
		const hidden = this.props.hidden;
		// const left = !hidden ? this.props.x : "-100vm"; 
		// const top = !hidden ? this.props.y : "-100vh"; 

		if(!hidden){
			hiddenStyle.left = this.props.x ? this.props.x : "50vw";
			hiddenStyle.top = this.props.y ? this.props.y : "50vh";
		} else {
			hiddenStyle.left = "-100vw"
			hiddenStyle.top = "-100vh";
		}

		return (
			<div style={hiddenStyle}>
				<Spinner name="circle" color="green" />
			</div>
		);
	}
}

export default MySpinner;