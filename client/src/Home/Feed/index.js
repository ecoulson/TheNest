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
		return this.filter().map((announcement) => {
			return <FeedEntity key={announcement.id} type="announcement" entity={announcement}/>
		});
	}

	filter() {
		let filteredBySearch = this.filterBySearch();
		let filteredByGrade = this.filterByGrade();
		let filteredByType = this.filterByType();
		return this.state.announcements.filter((announcement) => {
			return filteredByGrade.indexOf(announcement) !== -1 &&
					filteredBySearch.indexOf(announcement) !== -1 &&
					filteredByType.indexOf(announcement) !== -1;
		})
	}

	filterByGrade() {
		if (this.state.filters.grade !== null) {
			let grade = parseInt(this.state.filters.grade.toLowerCase().replace("grade", "").trim(), 10);
			return this.state.announcements.filter((announcement) => {
				return announcement.grades.includes(grade);
			});
		} else {
			return this.state.announcements;
		}
		
	}

	filterByType() {
		if (this.state.filters.type !== null) {
			return this.state.announcements.filter((announcement) => {
				return announcement.type === this.state.filters.type.toLowerCase();
			})
		} else {
			return this.state.announcements;
		}
	}

	filterBySearch() {
		return this.state.announcements.filter((announcement) => {
			let search = this.state.filters.search.toLowerCase();
			let grade = parseInt(search.toLowerCase().replace("grade", "").trim(), 10);
			let date = moment(announcement.dateCreated).format("MMMM Do, YY h:mA")
			return announcement.title.toLowerCase().startsWith(search) ||
					announcement.desc.toLowerCase().startsWith(search) ||
					announcement.author.toLowerCase().startsWith(search) ||
					date.toLowerCase().startsWith(search) ||
					announcement.grades.includes(grade) ||
					announcement.type === search
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