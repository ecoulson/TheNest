import React, { Component } from 'react';
import Feed from './Feed';
import FeedFilter from './FeedFilter';
import Module from '../Module';
import './home.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			grade: null,
			type: null,
			search: "",
			canCreate: false,
			hasFetched: false
		};
		this.setSearch = this.setSearch.bind(this);
		this.setGrade = this.setGrade.bind(this);
		this.setType = this.setType.bind(this);
		this.clear = this.clear.bind(this);
		this.renderCreateButton = this.renderCreateButton.bind(this);
	}

	componentWillMount() {
		fetch(`/api/user/can/Announcement:Create`, {
			credentials: "same-origin",
			method: "GET",
		}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.success) {
				this.setState({
					canCreate: json.can,
					hasFetched: true,
				})
			} else {
				this.setState({
					canCreate: false,
					hasFetched: true,
				})
			}
		});
	}

	setSearch(search) {
		this.setState({
			search: search
		});
	}

	setGrade(grade) {
		if (this.state.grade !== grade) {
			this.setState({
				grade: grade
			});
		}
	}

	setType(type) {
		if (this.state.type !== type) {
			this.setState({
				type: type
			});
		}
	}

	clear() {
		this.setState({
			grade: null,
			type: null,
			search: "",
		});
	}

	renderCreateButton() {
		if (!this.state.canCreate) {
			return null;
		}
		return (
			<Link className="create-announcement" to="/announcements">
				Create 
				<FontAwesomeIcon icon="plus-square"></FontAwesomeIcon>
			</Link>
		)
	}

	render() {
		return (
			<div>
				<div className="home-container">
					<Module background="transparent" width={"97.5%"} height={"auto"} title="Announcements">
						<div className="filter-container">
							{this.renderCreateButton()}
							<FeedFilter default="All Grades" set={this.setGrade} value={this.state.grade} type="select" by="grade"/>
							<FeedFilter default="All Types" set={this.setType} value={this.state.type} type="select" by="type"/>
							<FeedFilter set={this.setSearch} value={this.state.search} type="search" by="all"/>
						</div>
						<Feed filters={this.state}/>
					</Module>
				</div>
			</div>
		)
	}
}