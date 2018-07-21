import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './actionbar.css';

export default class Home extends Component {
	render() {
		return (
			<div className="action-bar">
				<span className="application-name">The Roost</span>
				<Link className="settings" to="/settings"><i className="fas fa-2x fa-cog"></i></Link>
				<Link className="notifications" to="/notifications"><i className="fab fa-2x fa-earlybirds"></i></Link>
			</div>
		)
	}
}