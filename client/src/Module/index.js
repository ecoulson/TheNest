import React, { Component } from 'react';
import './module.css';

export default class Module extends Component {
	constructor(props) {
		super();
		this.state = {
			...props,
			screenWidth: window.innerWidth,
			hasAccess: false
		}

		this.windowListener = this.windowListener.bind(this);
		window.addEventListener("resize", this.windowListener)
	}

	componentWillMount() {
		if (this.props.access) {
			fetch(`/api/user/can/${this.props.access}`, {
				credentials: 'same-origin'
			}).then((res) => {
				return res.json();
			}).then((json) => {
				this.setState({
					hasAccess: json.can
				})
			})
		} else {
			this.setState({
				hasAccess: true
			})
		}
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
			width: width > 1224 ? this.props.width : window.innerWidth - 50,
			marginRight: width > 1224 ? 0: "25px",
			height: this.props.height,
		}
	}

	getID() {
		let title = this.props.title;
		title = title.toLowerCase();
		let parts = title.split(' ');
		let id = "";
		for (let i in parts) {
			id += parts[i] + "-";
		}
		id = id.substring(0, id.length - 1);
		return id;
	}

	getBodyWidth() {
		let width = window.innerWidth;
		return {
			width: width > 1224 ? "calc(100% - 25px)" : "100%"
		}
	}

	getBackground() {
		return {
			backgroundColor: this.props.background ? this.props.background : "rgb(250,250,250)"
		};
	}

	getStyle() {
		return {
			...this.getSize(),
			...this.getBackground(),
		}
	}

	render() {
		if (!this.state.hasAccess) {
			return null;
		}

		if (this.state.hasAccess) {
			return (
				<div id={this.getID()} style={this.getStyle()} className="module-container">
					<div style={this.getBodyWidth()} className="module-body">
						{this.props.children}
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
}