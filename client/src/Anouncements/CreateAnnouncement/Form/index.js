import React, { Component } from 'react';
import FormData from './FormData';

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
		this.handleSubmittedForm = props.handleSubmittedForm;	
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

	render() {
		return (
			<div className="form">
				<input onChange={this.handleTitleInput} placeholder="Title..." className="title"/>
				<br/>
				<textarea onChange={this.handleAnnouncmentInput} placeholder="Announcement..." className="announcement">
				</textarea>
				<br/>
				<input onChange={this.handleAuthorInput} className="author" placeholder="Author..."/>
				<br/>
				<input onClick={this.handleSubmitClick} className="create" type="button" value="Submit Announcement"/>
			</div>
		)
	}
}