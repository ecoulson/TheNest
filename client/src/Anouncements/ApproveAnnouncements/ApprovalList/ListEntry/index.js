import React, { Component } from 'react';
import './entry.css';

export default class ListEntry extends Component {
	constructor(props) {
		super();
		this.state = props.entry;
		this.handleApproval = this.handleApproval.bind(this);
		this.handleRejection = this.handleRejection.bind(this);
	}

	handleApproval() {
		this.props.removeEntry(this.state.id);
		fetch(`/api/announcements/approve/`, {
			method: "POST",
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: this.serialzeEntry()
		})
	}

	handleRejection() {
		this.props.removeEntry(this.state.id);
		fetch(`/api/announcements/reject/`, {
			method: "POST",
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: this.serialzeEntry()
		})
	}

	serialzeEntry() {
		return JSON.stringify(this.state);
	}

	render() {
		return (
			<div className="entry">
				<span className="entry-title">{this.props.entry.title}</span>
				<input onClick={this.handleRejection} className="reject" type="button" value="reject"/>
				<input onClick={this.handleApproval} className="approve" type="button" value="approve"/>
			</div>
		);
	}
}