import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';
import Home from './Home';
import Anouncements from './Anouncements';
import ActiveAnnouncement from './ActiveAnnouncement';
import Navbar from './Navbar';
import ActionBar from './ActionBar';
import StatusBar from './StatusBar';
import NotFound from './NotFound';
import { spring, AnimatedSwitch } from 'react-router-transition';
import { AppProvider } from './AppContext';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { 
	faCog, 
	faHome, 
	faBullhorn,
	faCrow,
	faFileAlt,
	faFutbol,
	faPaintBrush,
	faTheaterMasks,
	faMusic,
	faUsers,
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

library.add(faCog);
library.add(faHome);
library.add(faBullhorn);
library.add(faCrow, faFileAlt, faFutbol, faPaintBrush, faMusic, faUsers);
library.add(faTheaterMasks, faChevronLeft, faChevronRight);
library.add(fab);


function mapStyles(styles) {
	return {
		opacity: styles.opacity,
		transform: `scale(${styles.scale})`,
	};
}
  
function bounce(val) {
	return spring(val, {
		stiffness: 400,
		damping: 25,
	});
}
  
const bounceTransition = {
	atEnter: {
		opacity: 0,
		scale: 1.1,
	},
	atLeave: {
		opacity: bounce(0),
		scale: bounce(0.9),
	},
	atActive: {
		opacity: bounce(1),
		scale: bounce(1),
	},
};

class App extends Component {
	render() {
		return (
			<Router>
				<AppProvider>
					<Navbar></Navbar>
					<ActionBar/>
					<div className="app-container">
						<AnimatedSwitch
							atEnter={bounceTransition.atEnter}
							atLeave={bounceTransition.atLeave}
							atActive={bounceTransition.atActive}
							mapStyles={mapStyles}
							className="route-wrapper">
							<Route exact path="/" component={Home}/>
							<Route exact path="/announcements" component={Anouncements}/>
							<Route path="/announcements/:id" component={ActiveAnnouncement}/>
							<Route component={NotFound} />
						</AnimatedSwitch>
					</div>
					<StatusBar/>
				</AppProvider>
			</Router>
		);
	}
}

export default App;
