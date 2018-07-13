import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './Home';
import Anouncements from './Anouncements';
import './App.css';

class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Home}/>
					<Route path="/a" component={Anouncements}/>
				</Switch>
			</Router>
		);
	}
}

export default App;
