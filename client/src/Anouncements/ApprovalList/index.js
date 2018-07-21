import React, { Component } from 'react';
import './approvallist.css';
import ListEntry from './ListEntry';

export default class ApprovalList extends Component {
	constructor(props) {
		super();
		this.state = {
			fetched: false,
			unapproved: props.unapproved
		}
		this.renderUnapprovedList = this.renderUnapprovedList.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			unapproved: props.unapproved
		})
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

	renderUnapprovedList() {
		return this.props.unapproved.map((announcement) => {
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