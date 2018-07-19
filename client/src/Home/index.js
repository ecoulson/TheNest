import React, { Component } from 'react';
import ActionBar from './ActionBar';
import DataFeed from './DataFeed';
import './home.css';

export default class Home extends Component {
	render() {
		return (
			<div className="dashboard-container">
				<DataFeed></DataFeed>
			</div>
		)
	}
}