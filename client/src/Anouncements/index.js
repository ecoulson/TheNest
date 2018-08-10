import React, { Component } from 'react';
import Module from '../Module';
import Form from './Form';
import ApprovalList from './ApprovalList';
import { Redirect } from 'react-router';
import './announcements.css';

export default class Anouncements extends Component {
	constructor() {
		super();
		this.state = {
			unapproved: [],
			fetchedAccess: false,
			fetchedUnapproved: false,
			formDisabled: true,
			canAccesPage: true,
		}
		this.getUnapprovedAnnouncements = this.getUnapprovedAnnouncements.bind(this);
	}

	componentWillMount() {
		fetch(`/api/user/can/Announcement:Create`, {
			credentials: 'same-origin'
		}).then((res) => {
			return res.json();
		}).then((json) => {
			this.setState({
				canAccesPage: json.can,
				fetchedAccess: true,
				formDisabled: false,
			}, () => {
				this.getUnapprovedAnnouncements();
			});
		})
	}

	getUnapprovedAnnouncements() {
		fetch(`/api/announcements/approve`, {
			credentials: 'same-origin',
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
		if (!this.state.canAccesPage) {
			return <Redirect to="/"/>
		}

		if (this.state.fetchedAccess && this.state.canAccesPage) {
			return (
				<div className="announcement-container">
					<Module title="Create Announcement" width={"40%"} height={"auto"}>
						<Form disabled={this.state.formDisabled} getUnapproved={this.getUnapprovedAnnouncements}/>
					</Module>
					<Module title="To Approve" width={"40%"} height={500}>
						<ApprovalList fetched={this.state.fetchedUnapproved} unapproved={this.state.unapproved}/>
					</Module>
				</div>
			);
		}

		return <div className="loader">Loading...</div>
	}
}