import React, { Component } from 'react';
import './index.css';

export default class WhoAmI extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canCreate: false,
			hasFetched: false
		}
	}

	componentWillMount() {
		fetch(`/api/user/can/Announcement:Create`, {
			credentials: "include",
			method: "GET",
		}).then((res) => {
			return res.json();
		}).then((json) => {
			if (json.success) {
				this.setState({
					canCreate: json.can,
					hasFetched: true,
				})
			} else {
				this.setState({
					canCreate: false,
					hasFetched: true,
				})
			}
		});
	}

	render() {
		let user = JSON.parse(getCookie('user')).username;
		if (this.state.hasFetched && this.state.canCreate) {
			return <h3 className="whoami">{user}</h3>;
		} else {
			return <h3 className="whoami">Guest</h3>;
		}
	}
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}