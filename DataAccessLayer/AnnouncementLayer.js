const DataAccessLayer = require('./DataAccessLayer');
const AnnouncementFactory = require('./AnnouncementFactory');
const LOAD_LIMIT = 20;

class AnnouncementLayer extends DataAccessLayer {
	constructor(database) {
		super("announcements", database, new AnnouncementFactory());
		this.approvedOffset = 0;
		this.unapprovedOffset = 0;
	}

	async getAnnouncement(id) {
		return await this.selectById(id);
	}

	async loadApprovedAnnouncements() {
		let announcements = await this.selectAllEntries([
			{ key: "Approved", value: true, comparator: "EQ" },
		]);
		return announcements;
	}

	async loadUnapprovedAnnouncements() {
		let announcements = await this.selectAllEntries([
			{ key: "Approved", value: false, comparator: "EQ" },
		]);
		return announcements;
	}

	async createAnnouncement(announcementData, outputEntry) {
		let announcementEntry = announcementDataToEntry(announcementData);
		return await this.createEntry(announcementEntry, outputEntry);
	}

	async approveAnnouncement(id) {
		return await this.updateEntry(id, {
			Approved: true
		});
	}

	async unapproveAnnouncement(id) {
		return await this.updateEntry(id, {
			Approved: false
		});
	}

	async rejectAnnouncement(id) {
		let rows = await this.deleteEntry(id, true);
		return rows;
	}
}

function announcementDataToEntry(data) {
	return {
		Title: data.title,
		Announcement: data.desc,
		AnnouncementType: data.type,
		Grades: arrayToString(data.grades),
		Author: data.author,
		Approved: false
	}
}

function arrayToString(a) {
	let string = "";
	for (let i = 0; i < a.length; i++) {
		string += a[i];
		if (i < a.length - 1) {
			string += ",";
		}
	}
	return string;
}

module.exports = AnnouncementLayer;