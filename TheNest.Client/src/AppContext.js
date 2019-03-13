import React, { Component } from 'react';

export const AppContext = React.createContext();

export class AppProvider extends Component {
	constructor() {
		super();
		this.state = {
			status: {
				message: "",
				color: "",
				fontColor: "",
				showing: false,
				duration: 3
			},
			showStatus: (status) => {},
			getOption: (type) => {}
		}
	}

	render() {
		return (
			<AppContext.Provider value={this.state}>
				{this.props.children}
			</AppContext.Provider>
		);
	}
}