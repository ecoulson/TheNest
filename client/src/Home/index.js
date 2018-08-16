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
			console.log(json);
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
		this.setState({
			grade: grade
		});
	}

	setType(type) {
		this.setState({
			type: type
		});
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
		console.log("here");
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
					<Module width={"70%"} height={"90.25%"} title="Announcements">
						<div className="filter-container">
							{this.renderCreateButton()}
							<FeedFilter default="All Grades" set={this.setGrade} value={this.state.grade} type="select" by="grade"/>
							<FeedFilter default="All Types" set={this.setType} value={this.state.type} type="select" by="type"/>
							<FeedFilter set={this.setSearch} value={this.state.search} type="search" by="all"/>
						</div>
						<Feed filters={this.state}/>
					</Module>
					<div className="nav-column">
						<Module width={"95%"} height={"100px"} title="Navbar">
							This is nav boi
						</Module>
						<Module width={"95%"} height={"400px"} title="Navbar2">
							This is nav boi part 2
						</Module>
					</div>
				</div>
				<div className="calendar-container">
					<img className="foobar" src="https://zapier.cachefly.net/storage/photos/a8219d503d5eb8f6d499f853178258f6.png"/>
				</div>
			</div>
		)
	}
}