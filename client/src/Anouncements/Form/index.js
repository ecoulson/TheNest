import React, { Component } from 'react';
import { AppContext } from '../../AppContext';
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
		let validationResult = formData.validate();
		if (validationResult.isValid) {
			this.handleSubmittedForm(formData);
		} else {
			this.showStatus({
				message: validationResult.message,
				color: "red",
				fontColor: "black",
				duration: 3
			})
		}
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
			this.showSubmittedStatus(payload.success, this.showStatus);
			this.setState({
				title: "",
				desc: "",
				author: "",
			});
		});
	}

	showSubmittedStatus(success) {
		if (success) {
			this.showStatus({
				message: "Successfully Submitted Announcement For Approval",
				color: "green",
				fontColor: "white",
				duration: 3
			});
			this.props.getUnapproved();
		} else {
			this.showStatus({
				message: "Failed To Submit Announcement For Approval",
				color: "red",
				fontColor: "black",
				duration: 3
			});
		}
	}

	render() {
		return (
			<div className="form">
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus
					}}
				</AppContext.Consumer>
				<input value={this.state.title} onChange={this.handleTitleInput} placeholder="Title..." className="form-title"/>
				<br/>
				<textarea value={this.state.desc} onChange={this.handleAnnouncmentInput} placeholder="Announcement..." className="form-desc">
				</textarea>
				<br/>
				<input value={this.state.author} onChange={this.handleAuthorInput} className="form-author" placeholder="Author..."/>
				<br/>
				<input onClick={this.handleSubmitClick} className="form-create" type="button" value="Submit Announcement"/>
			</div>
		)
	}
}