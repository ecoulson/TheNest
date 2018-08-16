import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';
import './actionbar.css';
import Owl from '../bird.png';
import Dropdown from './ActionBarDropdown';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			notifications: ["Test Notification"],
			notificationsVisible: false,
			settingsVisible: false
		}
		this.checkRole = this.checkRole.bind(this);
		this.handleAdminLogin = this.handleAdminLogin.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.toggleNotifications = this.toggleNotifications.bind(this);
		this.closeNotifications = this.closeNotifications.bind(this);
		this.closeSettings = this.closeSettings.bind(this);
		this.settingsItems = [
			{
				name: "Admin Login",
				action: this.handleAdminLogin
			},
			{
				name: "User Login",
				action: this.handleLogin
			},
			{
				name: "Logout",
				action: this.handleLogout
			}
		]
	}

	handleAdminLogin() {
		fetch('/api/user/login/admin', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			window.location.reload();
		})
	}

	handleLogin() {
		fetch('/api/user/login/user', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			window.location.reload();
		})
	}

	handleLogout() {
		fetch('/api/user/logout', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			window.location.reload();
		})
	}

	checkRole() {
		fetch('/api/user/', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			this.showStatus({
				message: `Current Role: ${json.role}`,
				color: "gray",
				fontColor: "black",
				duration: 3
			})
		})
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

	renderNotifications() {
		return this.state.notifications.map((notification, i) => {
			return (
				<li key={i} className="action-bar-menu-item">{notification}</li>
			)
		})
	}

	render() {
		return (
			<div className="action-bar">
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus;
					}}
				</AppContext.Consumer>
				<Link className="icon-link" to="/">
					<img alt="Owl" src={Owl} className="application-logo" size="2x" />
					<span className="application-name">The Nest</span>
				</Link>
				<Dropdown 
					visible={this.state.notificationsVisible}
					name="notifications" 
					icon="bell"
					items={this.notifications}
					closeOther={this.closeSettings}
					toggle={this.toggleNotifications}
					menuWidth={300}
					badge={true}
					badgeCount={1}
					>
					{this.renderNotifications()}
				</Dropdown>
				<Dropdown 
					visible={this.state.settingsVisible}
					name="settings" 
					icon="cog" 
					items={this.settingsItems}
					closeOther={this.closeNotifications}
					toggle={this.toggleSettings}
					menuWidth={150}
					>
					<li onClick={this.handleAdminLogin} key={"admin"} className="action-bar-menu-item">Admin Login</li>
					<li onClick={this.handleLogin} key={"user"} className="action-bar-menu-item">User Login</li>
					<hr className="action-bar-menu-item divider"/>
					<li onClick={this.checkRole} key={"check"} className="action-bar-menu-item">Check Role</li>
					<hr className="action-bar-menu-item divider"/>
					<li onClick={this.handleLogout} key={"logout"} className="action-bar-menu-item">Logout</li>
				</Dropdown>
			</div>
		)
	}
}