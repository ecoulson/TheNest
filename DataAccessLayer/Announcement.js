class Announcement {
	constructor(requestBody, id) {
		this._id = id;
		this.title = requestBody.title;
		this.desc = requestBody.desc;
		this.author = requestBody.author;
		this.grades = requestBody.grades;
		this.type = getType(requestBody);
		this.dateCreated = new Date();
		this.approved = false;
		this.pinned = false;
		this.pinnedDate = new Date();
	}
}

function getType(requestBody) {
	return requestBody.type.substring(0,1).toUpperCase() + 
		requestBody.type.substring(1, requestBody.type.length);
}

module.exports = Announcement;