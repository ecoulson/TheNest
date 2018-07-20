import moment from 'moment';

export default class FormData {
	constructor(state) {
		this.data = {
			...state,
			dateCreated: moment().format()
		}
	}

	serialize() {
		return JSON.stringify(this.data);
	}
}