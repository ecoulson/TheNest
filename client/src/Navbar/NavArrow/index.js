import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class NavArrow extends Component {
	render() {
		let style = {
			left: this.props.isOpen ? "180px" : "0px"
		}

		return (
			<div onClick={this.props.toggleNavbar} style={style} className="navbar-arrow">
				{this.props.isOpen ? 
					<FontAwesomeIcon size="2x" icon="chevron-left"/> :
					<FontAwesomeIcon size="2x" icon="chevron-right"/>
				}
			</div>
		)
	}
}