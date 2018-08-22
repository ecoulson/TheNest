import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from '../AppContext';
import './feedback.css'

export default class FeedbackBar extends Component {
	constructor() {
		super();
		this.handleNegativeReaction = this.handleNegativeReaction.bind(this);
		this.handlePositiveReaction = this.handlePositiveReaction.bind(this);
	}

	handlePositiveReaction() {
		fetch('/api/feedback/positive', {
			method: "POST",
			credentials: "same-origin"
		}).then((res) => {
			return res.json();
		}).then((json) => {
			this.showStatus({
				message: "Thank You For Your Feedback!",
				color: "#efdd8d",
				fontColor: "#37784f",
				duration: 3
			})
		})
	}

	handleNegativeReaction() {
		fetch('/api/feedback/negative', {
			method: "POST",
			credentials: "same-origin"
		}).then((res) => {
			return res.json();
		}).then((json) => {
			this.showStatus({
				message: "Thank You For Your Feedback!",
				color: "#efdd8d",
				fontColor: "#37784f",
				duration: 3
			})
		})
	}

	render() {
		return (
			<div className="feedback-bar">
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus;
					}}
				</AppContext.Consumer>
				<span className="feedback-desc">Feedback</span>
				<div onClick={this.handlePositiveReaction} className="feedback-icon">
					<FontAwesomeIcon icon="thumbs-up"/>
				</div>
				<div onClick={this.handleNegativeReaction} className="feedback-icon">
					<FontAwesomeIcon icon="thumbs-down"/>
				</div>
			</div>
		)
	}
}