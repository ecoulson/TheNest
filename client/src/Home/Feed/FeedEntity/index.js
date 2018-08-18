import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContextMenuTrigger } from "react-contextmenu";
import './feedentity.css';

const icons = {
	"sports": "futbol",
	"art": "paint-brush",
	"theatre": "theater-masks",
	"band": "music",
	"general": "bullhorn",
	"club": "users",
	"asb": "monument"
}

export default class FeedEntity extends Component {
	renderPin() {
		if (this.props.entity.pinned) {
			return (
				<FontAwesomeIcon className="feed-entity-pinned" size="1x" icon="thumbtack"/>
			)
		}
	}

	renderGrades() {
		if (this.props.entity.grades.length === 0) {
			return null;
		}
		return (
			<div className="feed-entity-grades">
				Grades:
				{
					this.props.entity.grades.map((grade) => {
						return parseInt(grade, 10);
					}).sort((a,b) => {
						return a < b;
					}).map((grade) => {
						return (
							<span key={grade} className="feed-entity-grade"> {grade}</span>
						)
					})
				}
			</div>
		);
	}

	getIcon() {
		return icons[this.props.entity.type];
	}

	shorten(str) {
		if (str.length >= 200) {
			return str.substring(0, 200) + "...";
		} else {
			return str;
		}
	}

	render() {
		return (
			<div>
				<ContextMenuTrigger collect={props => props} entity={this.props.entity} id={`contextmenu-${this.props.source ? this.props.source : "announcements"}`}>
					<Link to={`/announcements/${this.props.entity.id}`} className="feed-entity-container">
						<div className="feed-entity-header">
							{this.renderPin()}
							<FontAwesomeIcon className="feed-entity-type" size="1x" icon={this.getIcon()} />
							<h2 className="feed-entity-title">{this.props.entity.title}</h2>
							{this.renderGrades()}
						</div>
						<div className="split"/>
						<div className="feed-entity-body">
							<p className="feed-entity-desc">{this.shorten(this.props.entity.desc)}</p>
						</div>
						<div className="split"/>
						<div className="feed-entity-footer">
							<span className="feed-entity-date">{moment(this.props.entity.dateCreated).format("MMMM Do, YY h:mmA")}</span>
							<span className="feed-entity-author">{this.props.entity.author}</span>
						</div>
					</Link>
				</ContextMenuTrigger>
			</div>
		)
	}
}