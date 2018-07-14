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
	}
	
	componentWillMount() {
		fetch('/api/announcements')
			.then(res => res.json())
			.then(announcements => this.setState({
				'announcements': announcements, 
				hasFetchedAnnouncements: true
			}));
	}

	render() {
		console.log(this.state);
		if (this.state.hasFetchedAnnouncements) {
			return (
				<div className="feed-container">
					{
						this.state.announcements.map((x) => {
							return <FeedEntity key={new Date()} type="announcement" entity={x}/>
						})
					}
				</div>
			)
		} else {
			return <div className="feed-container"/>;
		}
	}
}