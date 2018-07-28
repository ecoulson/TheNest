import React, { Component } from 'react';
import moment from 'moment';
import './feedentity.css';

export default class FeedEntity extends Component {
	renderGrades() {
		return this.props.entity.grades.map((grade) => {
			return (
				<span key={grade} className="feed-entity-grade"> {grade}</span>
			)
		});
	}

	render() {
		return (
			<div className="feed-entity-container">
				<div className="feed-entity-header">
					<h2 className="feed-entity-title">{this.props.entity.title}</h2>
					<div className="feed-entity-grades">
						Grades: 
						{
							this.renderGrades()
						}
					</div>
				</div>
				<div className="split"/>
				<div className="feed-entity-body">
					<p className="feed-entity-desc">{this.props.entity.desc}</p>
				</div>
				<div className="split"/>
				<div className="feed-entity-footer">
					<span className="feed-entity-date">{moment(this.props.entity.dateCreated).format("MMMM Do, YY h:mA")}</span>
					<span className="feed-entity-author">{this.props.entity.author}</span>
				</div>
			</div>
		)
	}
}