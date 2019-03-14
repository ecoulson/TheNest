import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './navigation.css'

export default class Navigation extends Component {
	constructor() {
		super();
		this.state = {
			active: "home"
		}
	}

	render() {
		return (
			<div className="action-bar-menu-item action-bar-navigation">
				<Link id="home" className="action-bar-navlink" to="/">Home</Link>
				<hr className="action-bar-menu-item divider"/>
				<Link id="announcements" className="action-bar-navlink" to="/announcements">Announcements</Link>
			</div>
		)
	}
}