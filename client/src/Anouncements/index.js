import React, { Component } from 'react';
import Module from '../Module';
import Form from './Form';
import ApprovalList from './ApprovalList';
import { Redirect } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
			credentials: 'include'
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
		if (!this.state.canAccesPage) {
			return <Redirect to="/"/>
		}

		if (this.state.fetchedAccess && this.state.canAccesPage) {
			return (
				<ReactCSSTransitionGroup 
					className="announcement-container"
					transitionName="announcement-modules" 
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}>
					<Module access="Announcement:Create" title="Create Announcement" width={"45%"} height={"auto"}>
						<Form disabled={this.state.formDisabled} getUnapproved={this.getUnapprovedAnnouncements}/>
					</Module>
					<Module access="Admin" title="To Approve" width={"45%"} height={"500px"}>
						<ApprovalList fetched={this.state.fetchedUnapproved} unapproved={this.state.unapproved}/>
					</Module>
				</ReactCSSTransitionGroup>
			);
		}

		return (
			<div className="loader-container">
				<div className="loader white-loader">Loading...</div>
			</div>
		)
	}
}