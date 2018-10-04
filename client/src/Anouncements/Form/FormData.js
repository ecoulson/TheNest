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
			return this.getFailedValidation("Author must exist");
		}
		if (this.data.type === "") {
			return this.getFailedValidation("Announcement must have a type");
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
		this.data.type = this.data.type.value;
		this.data.grades = this.data.grades.map((grade) => {
			return grade.value;
		});
		return JSON.stringify(this.data);
	}
}