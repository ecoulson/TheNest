import React, { Component } from 'react';
import './module.css';

export default class Module extends Component {
	constructor(props) {
		super();
		this.state = {
			...props,
			screenWidth: window.innerWidth,
		}

		this.windowListener = this.windowListener.bind(this);
		window.addEventListener("resize", this.windowListener)
	}

	windowListener() {
		this.setState({
				screenWidth: window.innerWidth,
			});
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowListener);
	}


	getSize() {
		let width = window.innerWidth;
		return {
			width: width > 1224 ? this.props.width : "100%",
			height: this.props.height,
		}
	}

	render() {
		return (
			<div style={this.getSize()} className="module-container">
				<div className="module-header">
					<h1 className="module-title">{this.props.title}</h1>
				</div>
				<div className="module-body">
					{this.props.children}
				</div>
			</div>
		)
	}
}