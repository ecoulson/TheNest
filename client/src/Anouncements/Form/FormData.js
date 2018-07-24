import moment from 'moment';

export default class FormData {
	constructor(state) {
		this.data = {
			...state,
			dateCreated: moment().format()
		}
	}

	validate() {
		if (this.data.title === "") {
			return this.getFailedValidation("Announcement title can not be empty");
		}
		if (this.data.desc === "") {
			return this.getFailedValidation("Announcement can not be empty");
		}
		if (this.data.author === "") {
			return this.getFailedValidation("Author can not be empty");
		}
		return {
			isValid: true
		}
	}

	getFailedValidation(message, isValid) {
		return {
			message: message,
			isValid: false
		}
	}

	serialize() {
		return JSON.stringify(this.data);
	}
}