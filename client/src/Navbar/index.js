import React, { Component } from 'react';
import Navlink from './Navlink';
import './navbar.css';

export default class Navbar extends Component {
	render() {
		return (
			<ul className="navbar-container">
				<Navlink icon="home" to="/" title="Dashboard"/>
				<Navlink icon="bullhorn" to="/anouncements" title="Anouncements"/>
				<Navlink icon="file-alt" to="/resources" title="Resources"/>
			</ul>
		)
	}
}