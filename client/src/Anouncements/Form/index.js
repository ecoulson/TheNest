import React, { Component } from 'react';
import FormData from './FormData';
import './form.css';

export default class Form extends Component {
	constructor(props) {
		super();
		this.state = {
			title: "",
			desc: "",
			author: "",
		}
		this.handleTitleInput = this.handleTitleInput.bind(this);
		this.handleAuthorInput = this.handleAuthorInput.bind(this);
		this.handleAnnouncmentInput = this.handleAnnouncmentInput.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleSubmittedForm = this.handleSubmittedForm.bind(this);	
	}

	handleTitleInput(e) {
		this.setState({
			title: e.target.value
		});
	} 

	handleAnnouncmentInput(e) {
		this.setState({
			desc: e.target.value
		});
	}

	handleAuthorInput(e) {
		this.setState({
			author: e.target.value
		});
	}

	handleSubmitClick() {
		let formData = new FormData(this.state);
		this.handleSubmittedForm(formData);
	}

	handleSubmittedForm(formData) {
		fetch(`/api/announcements`, {
			method: "POST",
			body: formData.serialize(),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		}).then((res) => {
			return res.json();
		}).then((payload) => {
			if (payload.success) {
				this.props.getUnapproved();
			}
		});
	}

	render() {
		return (
			<div className="form">
				<input onChange={this.handleTitleInput} placeholder="Title..." className="form-title"/>
				<br/>
				<textarea onChange={this.handleAnnouncmentInput} placeholder="Announcement..." className="form-desc">
				</textarea>
				<br/>
				<input onChange={this.handleAuthorInput} className="form-author" placeholder="Author..."/>
				<br/>
				<input onClick={this.handleSubmitClick} className="form-create" type="button" value="Submit Announcement"/>
			</div>
		)
	}
}