import React, { Component } from 'react';
import Feed from './Feed';
import Module from '../Module';
import './home.css';

export default class Home extends Component {
	render() {
		return (
			<Module width={600} height={600} title="Feathers">
				<Feed/>
			</Module>
		)
	}
}