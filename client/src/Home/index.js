import React, { Component } from 'react';
import Feed from './Feed';
import FeedFilter from './FeedFilter';
import Module from '../Module';
import './home.css';

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			grade: null,
			type: null,
			search: "",
		};
		this.setSearch = this.setSearch.bind(this);
		this.setGrade = this.setGrade.bind(this);
		this.setType = this.setType.bind(this);
		this.clear = this.clear.bind(this);
	}

	setSearch(search) {
		this.setState({
			search: search
		});
	}

	setGrade(grade) {
		this.setState({
			grade: grade
		});
	}

	setType(type) {
		this.setState({
			type: type
		});
	}

	clear() {
		this.setState({
			grade: null,
			type: null,
			search: "",
		});
	}

	render() {
		return (
			<Module width={600} height={600} title="Feathers">
				<div style={{width: "100%", display: "flex"}}>
					<FeedFilter set={this.setGrade} value={this.state.grade} type="select" by="grade"/>
					<FeedFilter set={this.setType} value={this.state.type} type="select" by="type"/>
					<FeedFilter set={this.setSearch} value={this.state.search} type="search" by="all"/>
					<input onClick={this.clear} className="clear" value="Clear" type="button"/>
				</div>
				<Feed filters={this.state}/>
			</Module>
		)
	}
}