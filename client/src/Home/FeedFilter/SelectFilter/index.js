import React, { Component } from 'react';
import './selectfilter.css';
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome';

export default class SelectFilter extends Component {
	constructor(props) {
		super();
		this.state = {
			options: props.options,
			current: props.default
		}
		this.handleCurrent = this.handleCurrent.bind(this);
	}

	componentWillReceiveProps(props) {
		this.setState({
			current: props.value
		});
	}

	handleCurrent(e) {
		if (e.target.textContent === this.props.default) {
			this.props.set(null);
		} else {
			this.props.set(e.target.textContent);
		}
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
						(
							<span>
								{ this.props.default }
								<FontAwesomeIcon className="select-dropdown-arrow" icon="chevron-down"/>
							</span>
						):
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