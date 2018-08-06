import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { ContextMenu, MenuItem } from "react-contextmenu";
import FeedEntity from './FeedEntity';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from '../../AppContext';
import './feed.css';

const SCROLL_UPDATE_OFFSET = 50;
const LOAD_LIMIT = 20;

export default class Feed extends Component {
	constructor(props) {
		super();
		this.state = {
			announcements: [],
			filters: props.filters,
			hasFetchedAnnouncements: false,
			pinAction: "Pin",
			fetchingNextAnnouncements: false,
			offset: 0,
			announcementCount: 0
		};
		this.renderAnnouncements = this.renderAnnouncements.bind(this);
		this.handlePinnedAnnouncement = this.handlePinnedAnnouncement.bind(this);
		this.handleDeleteAnnouncement = this.handleDeleteAnnouncement.bind(this);
		this.handleRejectedAnnouncement = this.handleRejectedAnnouncement.bind(this);
		this.getPinAction = this.getPinAction.bind(this);
		this.handleDeleteAnnouncement = this.handleDeleteAnnouncement.bind(this);
		this.handleFeedScroll = this.handleFeedScroll.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			filters: props.filters
		});
	}
	
	componentWillMount() {
		this.fetchAnnouncementCount(() => {
			this.fetchPinned(this.fetchAnnouncements.bind(this));
		})
	}

	componentWillUnmount() {
		let element = document.getElementsByClassName('feed-container')[0];
		element.removeEventListener("scroll", this.handleFeedScroll);
	}

	fetchAnnouncementCount(next) {
		fetch('/api/announcements/')
			.then((res) => {
				return res.json();
			}).then((json) => {
				this.setState({
					announcementCount: json.count
				});
				next()
			})
	}

	fetchPinned(next) {
		fetch('/api/announcements/pinned')
			.then(res => res.json())
			.then((announcements) => {
				this.setState({
					announcements: announcements,
				});
				next();
			});
	}

	fetchAnnouncements() {
		fetch(`/api/announcements/load/${this.state.offset}`)
			.then(res => res.json())
			.then((announcements) => {
				let stateAnnouncements = this.state.announcements;
				announcements.forEach((announcement) => {
					stateAnnouncements.push(announcement);
				});
				this.setState({
					announcements: stateAnnouncements,
					hasFetchedAnnouncements: true,
					fetchingNextAnnouncements: false,
					offset: this.state.offset + LOAD_LIMIT
				});
				this.addFeedScrollListener();
			});
	}

	addFeedScrollListener() {
		let element = document.getElementsByClassName('feed-container')[0];
		element.addEventListener("scroll", this.handleFeedScroll);
	}

	handleFeedScroll(e) {
		let scrollTillBottom = e.target.scrollHeight - e.target.offsetHeight - e.target.scrollTop;
		if (scrollTillBottom < SCROLL_UPDATE_OFFSET && !this.state.fetchingNextAnnouncements && this.state.offset < this.state.announcementCount) {
			this.setState({
				fetchingNextAnnouncements: true,
			});
			this.fetchAnnouncements();
		}
	}

	renderAnnouncements() {
		return this.filter().map((announcement) => {
			return <FeedEntity source={this.props.feedSource} key={announcement.id} type="announcement" entity={announcement}/>
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
		if (this.state.filters && this.state.filters.grade !== null) {
			let grade = this.state.filters.grade.toLowerCase().replace("grade", "").trim();
			return this.state.announcements.filter((announcement) => {
				return announcement.grades.includes(grade);
			});
		} else {
			return this.state.announcements;
		}
		
	}

	filterByType() {
		if (this.state.filters && this.state.filters.type !== null) {
			return this.state.announcements.filter((announcement) => {
				return announcement.type === this.state.filters.type.toLowerCase();
			})
		} else {
			return this.state.announcements;
		}
	}

	filterBySearch() {
		if (this.state.filters) {
			return this.state.announcements.filter((announcement) => {
				let search = this.state.filters.search.toLowerCase();
				let grade = search.toLowerCase().replace("grade", "").trim();
				let date = moment(announcement.dateCreated).format("MMMM Do, YY h:mA")
				return announcement.title.toLowerCase().startsWith(search) ||
						announcement.desc.toLowerCase().startsWith(search) ||
						announcement.author.toLowerCase().startsWith(search) ||
						date.toLowerCase().startsWith(search) ||
						announcement.grades.includes(grade) ||
						announcement.type === search
			});
		} else {
			return this.state.announcements;
		}
	}

	getPinAction(e) {
		if (e.detail.data.entity.pinned) {
			this.setState({
				pinAction: "Unpin"
			});
		} else {
			this.setState({
				pinAction: "Pin"
			});
		}
	}

	handlePinnedAnnouncement(e, data) {
		fetch(`/api/announcements/pinned/${data.entity.id}`, {
			method: "PUT"
		}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.success) {
				let announcements = this.state.announcements;
				let index = this.getAnnouncementById(json.announcement.id);
				let announcement = announcements[index];
				announcement.pinned = !announcement.pinned;
				announcements = this.handleAnnouncementReposition(announcement, index);
				this.setState({
					announcements: announcements
				});
				let pinAction = json.announcement.pinned ? "Pinned" : "Unpinned"
				this.showStatus({
					message: `${pinAction} Announcement`,
					color: "green",
					fontColor: "white",
					duration: 3
				});
			} else {
				this.showStatus({
					message: `Failed To Toggle Pin Of The Announcement`,
					color: "red",
					fontColor: "black",
					duration: 3
				});
			}
		})
	}

	getAnnouncementById(id) {
		let announcements = this.state.announcements;
		for (let i = 0; i < announcements.length; i++) {
			if (announcements[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	handleAnnouncementReposition(announcement, index) {
		let announcements = this.state.announcements;
		announcements.splice(index, 1);
		let repositionIndex = -1;
		if (!announcement.pinned) {
			repositionIndex = this.getUnpinnedIndex(announcement);
		} else {
			repositionIndex = 0;
		}
		announcements.splice(repositionIndex, 0, announcement);
		return announcements;
	}

	getUnpinnedIndex(announcement) {
		let announcements = this.state.announcements;
		for (let i = 0; i < announcements.length; i++) {
			if (announcement.dateCreated > announcements[i].dateCreated && !announcements[i].pinned) {
				return i;
			}
		}
		return announcements.length;
	}

	handleRejectedAnnouncement(e, data) {
		fetch(`/api/announcements/unapprove/${data.entity.id}`, {
			method: "PUT"
		}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.success) {
				let announcements = this.state.announcements;
				let index = this.getAnnouncementById(data.entity.id);
				announcements.splice(index, 1);
				this.setState({
					announcements: announcements
				});
				this.showStatus({
					message: "Unapproved Announcement",
					color: "green",
					fontColor: "white",
					duration: 3
				});
			} else {
				this.showStatus({
					message: "Failed to unapprove Announcement",
					color: "red",
					fontColor: "black",
					duration: 3
				});
			}
		})
	}

	handleDeleteAnnouncement(e, data) {
		fetch(`/api/announcements/${data.entity.id}`, {
			method: "DELETE",
		}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.success) {
				let announcements = this.state.announcements;
				let index = this.getAnnouncementById(data.entity.id);
				announcements.splice(index, 1);
				this.setState({
					announcements: announcements
				});
				this.showStatus({
					message: "Deleted Announcement",
					color: "green",
					fontColor: "white",
					duration: 3
				})
			} else {
				this.showStatus({
					message: "Failed To Delete Announcement",
					color: "red",
					fontColor: "black",
					duration: 3
				})
			}
		});
	}

	render() {
		if (!this.state.hasFetchedAnnouncements) {
			return (
				<div className="loader">Loading...</div>
			);
		} else {
			return (
				<div className="feed-container">
					<AppContext.Consumer>
						{context => {
							this.showStatus = context.showStatus;
						}}
					</AppContext.Consumer>
					<ReactCSSTransitionGroup
						transitionName="feather"
						transitionEnterTimeout={250}
						transitionLeaveTimeout={250}>
						{this.renderAnnouncements()}
						{ this.state.fetchingNextAnnouncements ? 
							<div className="loader">Loading...</div> :
							null
						}
					</ReactCSSTransitionGroup>
					<ContextMenu onShow={this.getPinAction} collect={props => props} id={`contextmenu-${this.props.feedSource ? this.props.feedSource : "announcements"}`}>
						<MenuItem onClick={this.handlePinnedAnnouncement}>
							<FontAwesomeIcon className="entity-context-menu-icon" size="1x" icon="thumbtack"/>
							{this.state.pinAction} Announcement
						</MenuItem>
						<MenuItem  onClick={this.handleRejectedAnnouncement}>
							<FontAwesomeIcon className="entity-context-menu-icon" size="1x" icon="ban"/>
							Unapprove Announcement
						</MenuItem>
						<MenuItem  onClick={this.handleDeleteAnnouncement}>
							<FontAwesomeIcon className="entity-context-menu-icon" size="1x" icon="trash"/>
							Delete Announcement
						</MenuItem>
					</ContextMenu>
				</div>
			)
		}
	}
}