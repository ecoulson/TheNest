import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class NavArrow extends Component {
	render() {
		let style = {
			left: this.props.isOpen ? "175px" : "0px"
		}

		return (
			<div style={style} className="navbar-arrow">
				{this.props.isOpen ? 
					<FontAwesomeIcon onClick={this.props.toggleNavbar} size="2x" icon="chevron-left"/> :
					<FontAwesomeIcon onClick={this.props.toggleNavbar} size="2x" icon="chevron-right"/>
				}
			</div>
		)
	}
}