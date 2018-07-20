import React, { Component } from 'react';
import CreateAnnouncement from './CreateAnnouncement';
import ApproveAnnouncements from './ApproveAnnouncements';
import './announcements.css';

export default class Anouncements extends Component {
	render() {
		return (
			<div className="announcement-container">
				<CreateAnnouncement/>
				<ApproveAnnouncements/>
			</div>
		);
	}
}