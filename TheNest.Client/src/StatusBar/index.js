import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { AppContext } from '../AppContext';
import './statusbar.css';

export default class StatusBar extends Component {
	constructor() {
		super();
		this.state = {
			showing: false
		}
	}

	getCurrentStyle() {
		return {
			backgroundColor: this.state.color,
			color: this.state.fontColor,
		}
	}

	renderStatusBar() {
		if (this.state.showing) {
			return (
				<div style={this.getCurrentStyle()} className="status-bar">
					<span className="status-info">{this.state.message}</span>
				</div>
			);
		} else {
			return null;
		}
	}

	showStatus(status) {
		clearTimeout(this.timeout);
		this.setState(status);
		this.setState({
			showing: true
		})
		this.timeout = setTimeout(() => {
			this.setState({
				message: "",
				showing: false
			})
		}, status.duration * 1000);
	}

	render() {
		return (
			<div>
				<AppContext.Consumer>
					{context => {
						context.showStatus = this.showStatus.bind(this);
					}}
				</AppContext.Consumer>
				<ReactCSSTransitionGroup 
						transitionName="status" 
						transitionEnterTimeout={500} 
						transitionLeaveTimeout={500}>
					{this.renderStatusBar()}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}