import React, { Component } from 'react';
import Navlink from './Navlink';
import NavArrow from './NavArrow';
import $ from 'jquery';
import './navbar.css';

const NavbarLayout = [
	{
		icon: "home",
		link: "/",
		title: "Dashboard"
	},
	{
		icon: "bullhorn",
		link: "/announcements",
		title: "Announcements",
		access: "Announcement:Create"
	},
	{
		icon: "calendar",
		link: "/calendar",
		title: "Calendar"
	}
]

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			isOpen: window.innerWidth > 768,
			hasFetchedAccess: false,
			windowWidth: window.innerWidth
		}
		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.windowListener = this.windowListener.bind(this);
		window.addEventListener("resize", this.windowListener)
	}

	componentWillMount() {
		let awaiting = [];
		for (let i = 0; i < NavbarLayout.length; i++) {
			let item = NavbarLayout[i];
			if (item.access) {
				awaiting.push(i);
				let index = awaiting.length - 1;
				this.checkUserActions(item.access).then((hasAccess) => {
					item.hasAccess = hasAccess;
					awaiting.splice(index, 1);
					if (awaiting.length === 0) {
						this.setState({
							hasFetchedAccess: true
						})
					}
				});
			} else {
				item.hasAccess = true;
			}
		}
	}

	windowListener() {
		this.setState({
			windowWidth: window.innerWidth,
			isOpen: window.innerWidth > 768,
		})
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.windowListener);
	}

	toggleNavbar() {
		this.setState({
			isOpen: !this.state.isOpen,
		})
	}

	renderNavbarLayout() {
		if (this.state.hasFetchedAccess) {
			return NavbarLayout.map((item, i) => {
				if (item.hasAccess) {
					return <Navlink key={i} icon={item.icon} to={item.link} title={item.title}/>;
				} else {
					return null;
				}
			});
		} else {
			return null;
		}
	}

	checkUserActions(action) {
		return new Promise(async (resolve, reject) => {
			fetch(`/api/user/can/${action}`, {
				credentials: 'same-origin'
			}).then((res) => {
				return res.json();
			}).then((json) => {
				resolve(json.can);
			})
		});
	}

	render() {
		let elem = document.getElementsByClassName("navbar-container")[0];
		if (elem != null) {
			elem.style.maxWidth = this.state.isOpen ? "180px" : "0px";
			elem.childNodes.forEach((child) => {
				if (!this.state.isOpen) {
					$(child).hide();
				} else {
					$(child).fadeIn(500);
					$(child).css({
						display: "flex"
					})
				}
			});
		}

		return (
			<div>
				{/* <div className="navbar-container">
					{this.renderNavbarLayout()}
				</div>
				{ this.state.windowWidth < 768 ? 
					<NavArrow toggleNavbar={this.toggleNavbar} isOpen={this.state.isOpen}/> :
					null
				} */}
			</div>
		)
	}
}