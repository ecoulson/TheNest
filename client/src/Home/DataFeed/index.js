import React, { Component } from 'react';
import Feed from './Feed';
import './datafeed.css';

export default class DataFeed extends Component {
	render() {
		return (
			<div className="data-feed-container">
				<h1 className="data-feed-title">Feathers</h1>
				<Feed/>
			</div>
		)
	}
}