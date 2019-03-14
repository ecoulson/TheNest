import React, { Component } from 'react';
import moment from 'moment';
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

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
		} else if (grades.length === 0) {
			return "All Grades";
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
				<div className="entry-author-container">
					<span className="announcement-display-grades">Grades: {this.formatGrades(this.state.announcement.grades)}</span>
					<span className="announcement-display-type">{this.state.announcement.type}</span>
				</div>
				<div className="announcement-display-split"/>
				<FroalaEditorView
					model={this.state.announcement.desc}
				/>
				<div className="announcement-display-split"/>
				<div className="entry-author-container">
					<span className="announcement-display-date">{moment(this.state.announcement.dateCreated).format("MMMM Do, YY h:mmA")}</span>
					<span className="announcement-display-author">{this.state.announcement.author}</span>
				</div>
			</div>
		)
	}
}