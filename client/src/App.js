
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

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'

library.add(faCog);
library.add(faHome);
library.add(faBullhorn);
library.add(fab);
console.log(fab);

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
