import React, { Component } from 'react';
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
		})
	}

	render() {
		console.log(this.state);
		if (this.state.hasFetchedAnnouncements) {
			return (
				<div className="feed-container">
					{this.renderAnnouncements()}
				</div>
			)
		} else {
			return <div className="feed-container"/>;
		}
	}
}