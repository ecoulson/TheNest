import React, { Component } from 'react';
import Navlink from './Navlink';
import './navbar.css';

export default class Navbar extends Component {
	render() {
		return (
			<ul className="navbar-container">
				<Navlink to="/" title="Dashboard"/>
				<Navlink to="/anouncements" title="Anouncements"/>
			</ul>
		)
	}
}