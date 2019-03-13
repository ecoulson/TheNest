/**
 * Data transfer object for converting from an announcement
 * request body to an object that Mongo can create an object
 * from
 */
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

// Capitalizes the type becuase announcement types are 
// stored capitalized in the database
function getType(requestBody) {
	return requestBody.type.substring(0,1).toUpperCase() + 
		requestBody.type.substring(1, requestBody.type.length);
}

module.exports = Announcement;