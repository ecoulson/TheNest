import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { AppContext } from '../../AppContext';
import './approvallist.css';
import ListEntry from './ListEntry';

export default class ApprovalList extends Component {
	constructor(props) {
		super();
		this.state = {
			fetched: false,
			unapproved: props.unapproved,
			rejectedAnnouncements: []
		}
		this.renderUnapprovedList = this.renderUnapprovedList.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
		this.keyListener = this.keyListener.bind(this);

		window.addEventListener("keypress", this.keyListener)
	}

	keyListener(e) {
		if (e.key === 'z') {
			this.undo();
		}
	}

	componentWillUnmount() {
		window.removeEventListener("keypress", this.keyListener);
	}

	undo() {
		let rejectedAnnouncements = this.state.rejectedAnnouncements;
		let unapproved = this.state.unapproved;
		if (rejectedAnnouncements.length > 0) {
			let announcement = rejectedAnnouncements.shift();
			fetch(`/api/announcements/`, {
				method: "POST",
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(announcement)
			}).then((res) => {
				return res.json();
			}).then((payload) => {
				unapproved.splice(announcement.oldIndex, 0, payload.announcement);
				this.setState({
					unapproved: unapproved,
					rejectedAnnouncements: rejectedAnnouncements
				});
				this.handleUndoResponse(payload)
			})
		}
	}

	handleUndoResponse(payload) {
		if (payload.success) {
			this.showStatus({
				message: "Reverted Rejection of Previous Announcement",
				color: "gray",
				fontColor: "black",
				duration: 3
			})
		} else {
			this.showStatus({
				message: "Failed to Undo Previous Rejection",
				color: "red",
				fontColor: "black",
				duration: 3
			})
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			unapproved: props.unapproved
		})
	}

	removeEntry(id) {
		let unapproved = this.state.unapproved;
		console.log(id);
		for (let i = 0; i < unapproved.length; i++) {
			if (unapproved[i].id === id) {
				this.addToRejectedAnnouncements(unapproved[i], i);
				unapproved.splice(i, 1);
				console.log(unapproved);
			}
		}
		this.setState({
			unapproved: unapproved
		});
	}

	addToRejectedAnnouncements(rejectedAnnouncement, oldIndex) {
		let rejectedAnnouncements = this.state.rejectedAnnouncements;
		let announcement = Object.assign({}, rejectedAnnouncement);
		announcement.oldIndex = oldIndex
		rejectedAnnouncements.unshift(announcement);
		this.setState({
			rejectedAnnouncements: rejectedAnnouncements
		});
	}

	renderUnapprovedList() {
		return this.props.unapproved.map((announcement) => {
			return <ListEntry 
					key={announcement.id} 
					entry={announcement} 
					removeEntry={this.removeEntry}
					showStatus={this.showStatus}
					/>
		})
	}

	render() {
		return (
			<div className="entry-list">
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus;
					}}
				</AppContext.Consumer>
				<ReactCSSTransitionGroup 
					transitionName="approval" 
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}>
					{this.renderUnapprovedList()}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}