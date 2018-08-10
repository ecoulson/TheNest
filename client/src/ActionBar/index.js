import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './actionbar.css';
import Owl from '../bird.png';
import Dropdown from './ActionBarDropdown';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			notificationsVisible: false,
			settingsVisible: false
		}
		this.handleAdminLogin = this.handleAdminLogin.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.toggleNotifications = this.toggleNotifications.bind(this);
		this.closeNotifications = this.closeNotifications.bind(this);
		this.closeSettings = this.closeSettings.bind(this);
	}

	handleAdminLogin() {
		fetch('/api/')
	}

	handleLogin() {

	}

	handleLogout() {

	}

	toggleNotifications() {
		this.setState({
			notificationsVisible: !this.state.notificationsVisible
		})
	}

	closeNotifications() {
		this.setState({
			notificationsVisible: false
		})
	}

	toggleSettings() {
		this.setState({
			settingsVisible: !this.state.settingsVisible
		})
	}

	closeSettings() {
		this.setState({
			settingsVisible: false
		})
	}

	render() {
		return (
			<div className="action-bar">
				<Link className="icon-link" to="/">
					<img alt="Owl" src={Owl} className="application-logo" size="2x" />
					<span className="application-name">The Nest</span>
				</Link>
				<Dropdown 
					visible={this.state.notificationsVisible}
					name="notifications" 
					icon={['fab', 'earlybirds']} 
					items={['Your Announcement Was Approved!']}
					closeOther={this.closeSettings}
					toggle={this.toggleNotifications}
					menuWidth={300}
					badge={true}
					badgeCount={1}
					/>
				<Dropdown 
					visible={this.state.settingsVisible}
					name="settings" 
					icon="cog" 
					items={['Admin Login', 'User Login', 'Logout']}
					closeOther={this.closeNotifications}
					toggle={this.toggleSettings}
					menuWidth={150}
					/>
			</div>
		)
	}
}