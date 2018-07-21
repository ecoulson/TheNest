import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './actionbar.css';

export default class Home extends Component {
	render() {
		return (
			<div className="action-bar">
				<span className="application-name">The Roost</span>
				<Link className="settings" to="/settings">
					<FontAwesomeIcon size="2x" icon="cog" />
				</Link>
				<Link className="notifications" to="/notifications">
					<FontAwesomeIcon size="2x" icon={['fab', 'earlybirds']} />
				</Link>
			</div>
		)
	}
}