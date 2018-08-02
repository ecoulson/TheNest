import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './feedentity.css';

const icons = {
	"sports": "futbol",
	"art": "paint-brush",
	"theatre": "theater-masks",
	"band": "music",
	"general": "bullhorn",
	"club": "users",
}

export default class FeedEntity extends Component {
	constructor() {
		super();
		this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
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

	handleContextMenuClick() {
		console.log("hello");
	}

	render() {
		return (
			<div>
				<ContextMenuTrigger id='feed-entity-menu'>
					<Link to={`/announcements/${this.props.entity.id}`} className="feed-entity-container">
						<div className="feed-entity-header">
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
		
				<ContextMenu className="feed-entity-menu" id='feed-entity-menu'>
					<MenuItem data={{action: 'pin', id: this.props.entity.id}} onClick={this.handleContextMenuClick}>
						Pin Announcement
					</MenuItem>
					<MenuItem data={{action: 'unapprove', id: this.props.entity.id}} onClick={this.handleContextMenuClick}>
						Unapprove Announcement
					</MenuItem>
					<MenuItem data={{action: 'delete', id: this.props.entity.id}} onClick={this.handleContextMenuClick}>
						Delete Announcement
					</MenuItem>
				</ContextMenu>
			</div>
		)
	}
}