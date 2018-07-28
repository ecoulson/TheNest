import React, { Component } from 'react';
import './activeannouncement.css';
import Module from "../Module";
import AnnouncementDisplay from './AnnouncementDisplay';
import { AppContext } from '../AppContext';

export default class ActiveAnnouncement extends Component {
	constructor(props) {
		super();
		this.state = {
			hasLoaded: false,
			title: "",
			id: props.match.params["id"],
			status: null
		}
	}

	componentWillMount() {
		fetch(`/api/announcements/${this.state.id}`)
			.then(res => res.json())
			.then((announcement) => {
				this.setState({
					announcement: announcement,
					title: announcement.title,
					hasLoaded: true
				});
			}).catch((e) => {
				this.setState({
					status: {
						message: "Could Not Find Announcement",
						color: "red",
						fontColor: "black",
						duration: 3
					}
				})
				this.props.history.push('/');
			});
	}

	render() {
		let status = this.state.status;
		return (
			<div className="active-container">
				<AppContext.Consumer>
					{context => {
						if (status !== null) {
							context.showStatus(status);
						}
					}}
				</AppContext.Consumer>
				<Module title={this.state.title} width="100%" height="auto">
					{ this.state.hasLoaded ? 
						<AnnouncementDisplay announcement={this.state.announcement} />:
						<div className="loader">Loading...</div>	
					}
				</Module>
			</div>
		)
	}
}