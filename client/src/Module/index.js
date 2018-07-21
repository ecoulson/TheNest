import React, { Component } from 'react';
import './module.css';

export default class Home extends Component {
	render() {
		let style = {
			width: this.props.width,
			height: this.props.height
		}
		return (
			<div style={style} className="module-container">
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