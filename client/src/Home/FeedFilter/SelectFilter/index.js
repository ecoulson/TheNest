import React, { Component } from 'react';
import './selectfilter.css';

export default class SelectFilter extends Component {
	constructor(props) {
		super();
		this.state = {
			options: props.options,
			current: props.value
		}
		this.handleCurrent = this.handleCurrent.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			current: props.value,
		});
	}

	handleCurrent(e) {
		this.props.set(e.target.textContent);
	}

	renderOptions() {
		return this.state.options.map((option, i) => {
			return (
				<div key={i} onClick={this.handleCurrent} className="select-filter-option">
					{option}
				</div>
			)
		});
	}

	render() {
		return (
			<div className="select-filter">
				<span className="select-filter-current">
				{
					this.state.current === null ?
											this.props.by :
											this.state.current
				}
				</span>
				<div className="select-filter-options">
					{this.renderOptions()}
				</div>
			</div>
		);
	}
}