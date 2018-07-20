import React, { Component } from 'react';
import './approvallist.css';
import ListEntry from './ListEntry';

export default class ApprovalList extends Component {
	constructor() {
		super();
		this.state = {
			fetched: false,
			unapproved: []
		}
		this.renderUnapprovedList = this.renderUnapprovedList.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
	}

	removeEntry(id) {
		let unapproved = this.state.unapproved;
		for (let i = 0; i < unapproved.length; i++) {
			if (unapproved[i].id == id) {
				unapproved.splice(i, 1);
			}
		}
		this.setState({
			unapproved: unapproved
		})
	}

	componentWillMount() {
		fetch('/api/announcements/approve', {
			method: "GET"
		}).then((res) => {
			return res.json();
		}).then((unapproved) => {
			return this.setState({
				fetched: true,
				unapproved: unapproved
			})
		});
	}

	renderUnapprovedList() {
		return this.state.unapproved.map((announcement) => {
			return <ListEntry 
					key={announcement.id} 
					entry={announcement} 
					removeEntry={this.removeEntry}/>
		})
	}

	render() {
		return (
			<div className="entry-list">
				{this.renderUnapprovedList()}
			</div>
		);
	}
}