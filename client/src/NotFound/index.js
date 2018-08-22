import React, { Component } from 'react';
import NotFoundImg from '../NotFound.png';
import './notfound.css';

export default class NotFound extends Component {
	render() {
		return (
			<div className="notfound-container">
				<img alt="Not Found" className="notfound-img" src={NotFoundImg}/>
				<h2 className="notfound-txt">Sorry, This Page Was Not Found</h2>
			</div>	
		);
	}
}