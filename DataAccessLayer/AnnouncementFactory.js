class AnnouncementFactory {
	convertRows(rows) {
		let announcements = [];
		rows.forEach((row) => {
			announcements.push(new Announcement(row));
		});
		return announcements;
	}
}

class Announcement {
	constructor(row) {
		this.title = row.getProperty("Title");
		this.id = row.getProperty("ID");
		this.type = row.getProperty("AnnouncementType");
		this.grades = row.getProperty("Grades").split(",");
		this.desc = row.getProperty("Announcement");
		this.author = row.getProperty("Author");
		this.dateCreated = new Date(row.getProperty("DateCreated"));
		this.approved = row.getProperty("Approved").toLowerCase() === "true";
		this.pinned = row.getProperty("Pinned").toLowerCase() === "true";
		this.pinnedDate = new Date(row.getProperty("PinnedDateTime"));
	}
}

module.exports = AnnouncementFactory;