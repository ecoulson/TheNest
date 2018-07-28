import React, { Component } from 'react';

export default class AnnouncementDisplay extends Component {
	formatGrades(grades) {
		let string = "";
		for (let i = 0; i < grades.length; i++) {
			string += grades[i] + ", ";
		}
		return string.substring(0, string.length - 2);
	}

	render() {
		return (
			<div className="announcement-display">
				<span className="announcement-display-grades">Grades: {this.formatGrades(this.props.announcement.grades)}</span>
				<span className="announcement-display-type">{this.props.announcement.type}</span>
				<div className="announcement-display-split"/>
				<div className="announcement-display-desc">{this.props.announcement.desc}</div>
				<div className="announcement-display-split"/>
				<span className="announcement-display-date">{this.props.announcement.dateCreated}</span>
				<span className="announcement-display-author">{this.props.announcement.author}</span>
			</div>
		)
	}
}