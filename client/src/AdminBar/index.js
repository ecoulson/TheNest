import React, { Component } from 'react';
import './adminbar.css';

export default class AdminBar extends Component {
	constructor() {
		super();
		this.state = {
			hasAccess: false
		}
	}

	componentWillMount() {
		fetch(`/api/user/can/Admin`, {
			method: "GET",
			credentials: "same-origin"
		}).then((res) => {
			return res.json();
		}).then((json) => {
			this.setState({
				hasAccess: json.can
			})
		})
	}

	render() {
		if (!this.state.hasAccess) {
			return null;
		}
		return (
			<div className="admin-bar">
				<div className="admin-bar-text">Admin Bar</div>
			</div>
		)
	}
}