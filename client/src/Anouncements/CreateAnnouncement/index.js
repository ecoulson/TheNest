import React, { Component } from 'react';
import Form from './Form';
import './createannouncement.css'

export default class CreateAnnouncement extends Component {
	constructor() {
		super();
		this.state = {
			formData: {}
		}

		this.handleSubmittedForm = this.handleSubmittedForm.bind(this);
	}

	handleSubmittedForm(formData) {
		fetch(`/api/announcements`, {
			method: "POST",
			body: formData.serialize(),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		})
	}

	render() {
		return (
			<div className="create-container">
				<h1 className="title">Create Announcement</h1>
				<Form handleSubmittedForm={this.handleSubmittedForm}/>
			</div>
		)
	}
}