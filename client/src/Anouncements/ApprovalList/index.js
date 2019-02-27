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
		}
		this.renderUnapprovedList = this.renderUnapprovedList.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
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
		console.log(index);
		unapproved.splice(index, 1);
		this.setState({
			unapproved: unapproved
		});
	}

	getIndex(id, unapproved) {
		for (let i = 0; i < unapproved.length; i++) {
			if (unapproved[i]._id === id) {
				return i;
			}
		}
		return -1;
	}

	renderUnapprovedList() {
		return this.props.unapproved.map((announcement) => {
			return <ListEntry 
					key={announcement._id} 
					entry={announcement} 
					removeEntry={this.removeEntry}
					/>
		})
	}

	render() {
		if (!this.state.fetched) {
			return (
				<div className="white-loader">Loading...</div>
			);
		} else {
			return (
				<div className="entry-list">
					<h1 className="entry-list-title">Approve Announcements</h1>
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