import React, { Component } from 'react';
import ApprovalList from './ApprovalList';
import './approveannouncements.css';

export default class ApproveAnnouncements extends Component {
	render() {
		return (
			<div className="container">
				<h1 className="title">To Be Approved</h1>
				<ApprovalList/>
			</div>
		);
	}
}