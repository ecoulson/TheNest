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
			let grade = this.state.filters.search.toLowerCase().replace("grade", "").trim();
			let search = this.state.filters.search.toLowerCase();
			let date = moment(announcement.dateCreated).format("MMMM Do, YY h:mA")
			return announcement.title.toLowerCase().includes(search) ||
					announcement.desc.toLowerCase().includes(search) ||
					announcement.author.toLowerCase().includes(search) ||
					date.toLowerCase().includes(search) ||
					announcement.type.toLowerCase() == search ||
					announcement.grades.includes(parseInt(grade));
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