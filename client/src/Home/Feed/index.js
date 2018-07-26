import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FeedEntity from './FeedEntity';
import moment from 'moment';
import './feed.css';

export default class Feed extends Component {
	constructor(props) {
		super();
		this.state = {
			announcements: [],
			filters: props.filters,
			hasFetchedAnnouncements: false,
		};
		this.renderAnnouncements = this.renderAnnouncements.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			filters: props.filters
		});
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
		return this.filterBySearch().map((announcement) => {
			return <FeedEntity key={announcement.id} type="announcement" entity={announcement}/>
		});
	}

	filterBySearch() {
		return this.state.announcements.filter((announcement) => {
			let date = moment(announcement.dateCreated).format("MMMM Do, YY h:mA")
			return announcement.title.toLowerCase().includes(this.state.filters.search) ||
					announcement.desc.toLowerCase().includes(this.state.filters.search) ||
					announcement.author.toLowerCase().includes(this.state.filters.search) ||
					date.toLowerCase().includes(this.state.filters.search);
		})
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