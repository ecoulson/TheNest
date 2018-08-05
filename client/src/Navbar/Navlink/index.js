import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './navlink.css';

export default class Navlink extends Component {
	render() {
		return (
			<Link className="navlink" to={this.props.to}>
				<FontAwesomeIcon className="navlink-icon" size="1x" icon={this.props.icon}/>
				<span className="navlink-desc">{this.props.title}</span>
			</Link>
		)
	}
}