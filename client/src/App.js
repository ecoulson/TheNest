import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './Home';
import Anouncements from './Anouncements';
import Navbar from './Navbar';
import ActionBar from './ActionBar';
import './App.css';

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Navbar></Navbar>
					<ActionBar/>
					<div className="app-container">
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route path="/anouncements" component={Anouncements}/>
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
