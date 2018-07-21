import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './navlink.css';

export default class Navlink extends Component {
	render() {
		return (
			<Link className="navlink" to={this.props.to}>
				<i className={`navlink-icon fas fa-1x fa-${this.props.icon}`}/><span className="navlink-desc">{this.props.title}</span>
			</Link>
		)
	}
}