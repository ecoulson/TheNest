import React, { Component } from 'react';
import SearchFilter from './SearchFilter';
import SelectFilter from './SelectFilter';

const options = {
	grade: [
		"Grade 12",
		"Grade 11",
		"Grade 10",
		"Grade 9",
		"Grade 8",
		"Grade 7",
		"Grade 6",
		"Grade 5",
	],
	type: [
		"Sports",
		"Art",
		"Theatre",
		"Music",
		"General",
		"Form"
	]
}

export default class FeedFilter extends Component {
	render() {
		if (this.props.type === "select") {
			return ( 
				<SelectFilter value={this.props.value} set={this.props.set} by={this.props.by} options={options[this.props.by]}/>
			)
		} else {
			return ( 
				<SearchFilter value={this.props.value} set={this.props.set} by={this.props.by}/>
			)
		}
	}
}