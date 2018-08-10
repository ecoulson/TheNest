import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { AppContext } from '../../AppContext';
import './approvallist.css';
import ListEntry from './ListEntry';

export default class ApprovalList extends Component {
	constructor(props) {
		super();
		this.state = {
			fetched: props.fetched,
			unapproved: props.unapproved,
			undoActions: [],
		}
		this.renderUnapprovedList = this.renderUnapprovedList.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
		this.addUndoAction = this.addUndoAction.bind(this);
		this.undo = this.undo.bind(this);
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

	componentWillReceiveProps(props) {
		this.setState({
			unapproved: props.unapproved,
			fetched: props.fetched
		})
	}

	removeEntry(id) {
		let unapproved = this.state.unapproved;
		let index = this.getIndex(id, unapproved);
		unapproved.splice(index, 1);
		this.setState({
			unapproved: unapproved
		});
	}

	getIndex(id, unapproved) {
		for (let i = 0; i < unapproved.length; i++) {
			if (unapproved[i].id === id) {
				return i;
			}
		}
		return -1;
	}

	addUndoAction(action) {
		let actions = this.state.undoActions;
		let unapproved = this.state.unapproved;
		action.index = this.getIndex(action.entry.id, unapproved);
		actions.push(action);
		this.setState({
			undoActions: actions
		});
	}

	undo() {
		let undoActions = this.state.undoActions;
		if (undoActions.length > 0) {
			let action = undoActions.shift();
			this.setState({
				undoActions: undoActions
			});
			this.handleUndoAction(action);
		}
	}

	handleUndoAction(action) {
		if (action.type === "approval") {
			this.handleApprovalUndo(action);
		} else {
			this.handleRejectionUndo(action);
		}
	}

	handleApprovalUndo(action) {
		fetch(`/api/announcements/unapprove/${action.entry.id}`, {
			method: "PUT",
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(action.announcement)
		}).then((res) => {
			return res.json();
		}).then((payload) => {
			this.addPayloadToUI(action, payload);
		});
	}

	addPayloadToUI(action, payload) {
		let unapproved = this.state.unapproved;
		unapproved.splice(action.index, 0, payload.announcement);
		this.setState({
			unapproved: unapproved,
		});
		this.handleUndoResponse(payload);
	}

	handleRejectionUndo(action) {
		fetch(`/api/announcements/`, {
			method: "POST",
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(action.entry)
		}).then((res) => {
			return res.json();
		}).then((payload) => {
			this.addPayloadToUI(action, payload);
		});
	} 

	handleUndoResponse(payload) {
		if (payload.success) {
			this.showStatus({
				message: "Undid Previous Action!",
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

	renderUnapprovedList() {
		return this.props.unapproved.map((announcement) => {
			return <ListEntry 
					key={announcement.id} 
					entry={announcement} 
					removeEntry={this.removeEntry}
					addUndoAction={this.addUndoAction}
					/>
		})
	}

	render() {
		if (!this.state.fetched) {
			return (
				<div className="loader">Loading...</div>
			);
		} else {
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
}