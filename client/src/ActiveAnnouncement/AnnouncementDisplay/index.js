import React, { Component } from 'react';
import moment from 'moment';
import Dante from 'Dante2'

export default class AnnouncementDisplay extends Component {
	constructor(props) {
		super();
		this.state = {
			announcement: props.announcement
		}
	}

	formatGrades(grades) {
		if (!grades) {
			return "";
		} else {
			let string = "";
			for (let i = 0; i < grades.length; i++) {
				string += grades[i] + ", ";
			}
			return string.substring(0, string.length - 2);
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			announcement: props.announcement
		})
	}	

	render() {
		return (
			<div className="announcement-display">
				<span className="announcement-display-grades">Grades: {this.formatGrades(this.state.announcement.grades)}</span>
				<span className="announcement-display-type">{this.state.announcement.type}</span>
				<div className="announcement-display-split"/>
				<Dante content={JSON.parse(this.state.announcement.desc)} read_only={true}></Dante>
				<div className="announcement-display-split"/>
				<span className="announcement-display-date">{moment(this.state.announcement.dateCreated).format("MMMM Do, YY h:mmA")}</span>
				<span className="announcement-display-author">{this.state.announcement.author}</span>
			</div>
		)
	}
}