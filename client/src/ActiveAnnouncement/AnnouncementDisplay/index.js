import React, { Component } from 'react';
import moment from 'moment';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

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
				<Editor
					text={this.state.announcement.desc}
					options={{disableEditing: true, toolbar: false }}
				/>
				<div className="announcement-display-split"/>
				<span className="announcement-display-date">{moment(this.state.announcement.dateCreated).format("MMMM Do, YY h:mmA")}</span>
				<span className="announcement-display-author">{this.state.announcement.author}</span>
			</div>
		)
	}
}