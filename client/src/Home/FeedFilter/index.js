import React, { Component } from 'react';
import SearchFilter from './SearchFilter';
import SelectFilter from './SelectFilter';

export default class FeedFilter extends Component {
	constructor() {
		super();
		this.state = {
			options: {
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
					"Band",
					"General",
					"Clubs"
				]
			},
		}
		this.getOption = this.getOption.bind(this);
	}

	getOption(type) {
		return this.state.options[type];
	}

	render() {
		if (this.props.type === "select") {
			return ( 
				<SelectFilter 
						value={this.props.value} 
						set={this.props.set} 
						by={this.props.by}
						placeholder={this.props.placeholder}
						options={this.state.options[this.props.by]}/>
			)
		} else {
			return ( 
				<SearchFilter placeholder={this.props.placeholder} value={this.props.value} set={this.props.set} by={this.props.by}/>
			)
		}
	}
}