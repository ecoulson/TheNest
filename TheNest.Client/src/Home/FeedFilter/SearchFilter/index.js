import React, { Component } from 'react';
import './searchfilter.css';

export default class SearchFilter extends Component {
	constructor(props) {
		super();
		this.state = {
			value: props.value,
		}
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			value: props.value
		});
	}

	handleSearch(e) {
		this.props.set(e.target.value);
	}

	render() {
		return (
			<input
				className="search-filter" 
				onChange={this.handleSearch} 
				value={this.state.value} 
				placeholder="Search..."/>
		)
	}
}