import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
	render() {
		return (
			<div>
				<Link to="/a">LINK</Link>
				<h1>Home</h1>
			</div>
		)
	}
}