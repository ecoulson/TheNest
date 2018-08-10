import React, { Component } from 'react';
import Module from '../Module';
import Form from './Form';
import ApprovalList from './ApprovalList';
import './announcements.css';

export default class Anouncements extends Component {
	constructor() {
		super();
		this.state = {
			unapproved: [],
			fetchedUnapproved: false
		}
		this.getUnapprovedAnnouncements = this.getUnapprovedAnnouncements.bind(this);
	}

	componentWillMount() {
		this.getUnapprovedAnnouncements();
	}

	getUnapprovedAnnouncements() {
		fetch(`/api/announcements/approve`, {
			credentials: 'include',
			method: "GET",
		}).then((res) => {
			return res.json();
		}).then((res) => {
			this.setState({
				unapproved: res.announcements,
				fetchedUnapproved: true
			})
		})
	}
	
	render() {
		return (
			<div className="announcement-container">
				<Module title="Create Announcement" width={"40%"} height={"auto"}>
					<Form getUnapproved={this.getUnapprovedAnnouncements}/>
				</Module>
				<Module title="To Approve" width={"40%"} height={500}>
					<ApprovalList fetched={this.state.fetchedUnapproved} unapproved={this.state.unapproved}/>
				</Module>
			</div>
		);
	}
}