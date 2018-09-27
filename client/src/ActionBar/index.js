import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';
import './actionbar.css';
import Owl from '../bird.png';
import Dropdown from './ActionBarDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navigation from './Navigation';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			notifications: ["Test Notification"],
			notificationsVisible: false,
			settingsVisible: false,
			menuVisible: false,
		}
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.toggleNotifications = this.toggleNotifications.bind(this);
		this.closeNotifications = this.closeNotifications.bind(this);
		this.closeSettings = this.closeSettings.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
	}

	handleLogin() {
		fetch('/api/user/login/', {
			credentials: 'include'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			window.location = json.location;
		})
	}

	handleLogout() {
		fetch('/api/user/logout', {
			credentials: 'include'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			window.location.reload();
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

	toggleMenu() {
		this.setState({
			menuVisible: !this.state.menuVisible
		});
	}

	closeMenu() {
		this.setState({
			menuVisible: false,
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
					closeOther={[this.closeSettings, this.closeMenu]}
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
					closeOther={[this.closeNotifications, this.closeMenu]}
					toggle={this.toggleSettings}
					menuWidth={150}
					>
					<li onClick={this.handleLogin} key={"user"} className="action-bar-menu-item">Login</li>
					<hr className="action-bar-menu-item divider"/>
					<li onClick={this.handleLogout} key={"logout"} className="action-bar-menu-item">Logout</li>
				</Dropdown>
				<Dropdown
					visible={this.state.menuVisible}
					name="menu" 
					icon="bars" 
					closeOther={[this.closeNotifications, this.closeSettings]}
					toggle={this.toggleMenu}
					menuWidth={300}
					>
					<h3 className="action-bar-header action-bar-menu-item">Navigation</h3>
					<Navigation></Navigation>
					<h3 className=" action-bar-header action-bar-menu-item">Feed</h3>
				</Dropdown>
			</div>
		)
	}
}