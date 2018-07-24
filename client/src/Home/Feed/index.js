import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FeedEntity from './FeedEntity';
import './feed.css';

export default class Feed extends Component {
	constructor() {
		super();
		this.state = {
			announcements: [],
			hasFetchedAnnouncements: false,
		};
		this.renderAnnouncements = this.renderAnnouncements.bind(this);
	}
	
	componentWillMount() {
		fetch('/api/announcements')
			.then(res => res.json())
			.then((announcements) => {
				this.setState({
					announcements: announcements, 
					hasFetchedAnnouncements: true
				});
			});
	}

	renderAnnouncements() {
		return this.state.announcements.map((announcement) => {
			return <FeedEntity key={announcement.id} type="announcement" entity={announcement}/>
		});
	}

	render() {
		return (
			<div className="feed-container">
				<ReactCSSTransitionGroup
					transitionName="feather"
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}>
					{this.renderAnnouncements()}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}