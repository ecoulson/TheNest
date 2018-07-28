import React, { Component } from 'react';
import Navlink from './Navlink';
import NavArrow from './NavArrow';
import './navbar.css';

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			isOpen: window.innerWidth > 768,
			windowWidth: window.innerWidth
		}
		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.windowListener = this.windowListener.bind(this);
		window.addEventListener("resize", this.windowListener)
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

	render() {
		let elem = document.getElementsByClassName("navbar-container")[0];
		if (elem != null) {
			elem.style.maxWidth = this.state.isOpen ? "175px" : "0px";
			elem.childNodes.forEach((child) => {
				child.style.opacity = this.state.isOpen ? 1 : 0;
			});
		}

		return (
			<div>
				<ul className="navbar-container">
					<Navlink icon="home" to="/" title="Dashboard"/>
					<Navlink icon="bullhorn" to="/anouncements" title="Anouncements"/>
					<Navlink icon="file-alt" to="/resources" title="Resources"/>
				</ul>
				{ this.state.windowWidth < 768 ? 
					<NavArrow toggleNavbar={this.toggleNavbar} isOpen={this.state.isOpen}/> :
					null
				}
			</div>
		)
	}
}