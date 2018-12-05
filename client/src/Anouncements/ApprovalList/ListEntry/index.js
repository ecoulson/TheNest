import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { AppContext } from '../../../AppContext';
import $ from "jquery";
import './entry.css';
import Dante from 'Dante2'

export default class ListEntry extends Component {
	constructor(props) {
		super();
		this.state = {
			entry: {
				...props.entry,
			},
			style: {
				opacity: 0
			},
			showingDesc: false,
		};
		this.handleApproval = this.handleApproval.bind(this);
		this.handleRejection = this.handleRejection.bind(this);
		this.requestApproval = this.requestApproval.bind(this);
		this.requestRejection = this.requestRejection.bind(this);
		this.showDesc = this.showDesc.bind(this);
	}

	getDisplayTitle() {
		let displayTitle = this.state.entry.title;
		if (displayTitle.length > 20) {
			displayTitle = displayTitle.substring(0, 19) + "...";			
		}
		return displayTitle;
	}

	componentWillMount() {
		let entry = this.state.entry;
		entry.displayTitle = this.getDisplayTitle()
		this.setState({
			entry: entry
		})
		setTimeout(() => {
			this.setState({
				style: {
					opacity: 1,
				}
			})
		}, 100)
	}

	handleApproval() {
		this.props.removeEntry(this.state.entry.id);
		this.hideAnnouncement();
		this.requestApproval();
	}

	hideAnnouncement() {
		let element = document.getElementById(`list-desc-entry-${this.state.entry.id}`);
		if (element != null) {
			setTimeout(() => {
				$(element).hide();
			}, 100);
			this.setState({
				style: {
					opacity: 0,
				},
				showingDesc: false
			});
		}
	}

	requestApproval() {
		fetch(`/api/announcements/approve/`, {
			method: "POST",
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: this.serialzeEntry()
		}).then((res) => {
			return res.json();
		}).then(() => {
			this.showStatus({
				message: "Announcement Approved",
				color: "#37784f",
				fontColor: "white",
				duration: 3
			});
		});
	}

	handleRejection() {
		this.props.removeEntry(this.state.entry.id);
		this.hideAnnouncement();
		this.requestRejection();
	}

	requestRejection() {
		fetch(`/api/announcements/reject/`, {
			method: "POST",
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: this.serialzeEntry()
		}).then((res) => {
			return res.json();
		}).then(() => {
			this.showStatus({
				message: "Rejected Announcement",
				color: "red",
				fontColor: "black",
				duration: 3
			});
		});
	}

	serialzeEntry() {
		return JSON.stringify(this.state.entry);
	}

	showDesc(e) {
		let element = document.getElementById(`list-desc-entry-${this.state.entry.id}`);
		if (element !== null && e.target.className.trim() !== "approve") {
			$(element).slideToggle();
		} else {
			$(element).hide(0);
		}
		this.setState({
			showingDesc: !this.state.showingDesc
		});
	}

	render() {
		return (
			<div>
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus;
					}}
				</AppContext.Consumer>
				<div onClick={this.showDesc} data-tip="React-tooltip" className="entry">
					<span style={this.state.style} className="entry-title">{this.state.entry.displayTitle}</span>
					<input style={this.state.style} onClick={this.handleRejection} className="reject" type="button" value="reject"/>
					<input style={this.state.style} onClick={this.handleApproval} className="approve" type="button" value="approve"/>
					<div id={`list-desc-entry-${this.state.entry.id}`}>
						<Dante content={JSON.parse(this.state.entry.desc)} read_only={true}></Dante>
						<span>By: {this.state.entry.author}</span>
						<span style={{float:"right"}}>Grades: {this.state.entry.grades}</span>
					</div>
				</div>
				{ this.state.showingDesc ? 
					null :
					(
						<ReactTooltip delayShow={1000} place="top" type="light" effect="solid">
							<span>Click For More Info</span>
						</ReactTooltip>
					)
				}
			</div>
		);
	}
}