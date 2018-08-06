const DataAccessLayer = require('./DataAccessLayer');
const AnnouncementFactory = require('./AnnouncementFactory');
const moment = require('moment');
const LOAD_LIMIT = 20;

class AnnouncementLayer extends DataAccessLayer {
	constructor(database) {
		super("announcements", database, new AnnouncementFactory());
		this.approvedOffset = 0;
		this.unapprovedOffset = 0;
	}

	async getAnnouncementCount() {
		return await this.getRowCount();
	}

	async getAnnouncement(id) {
		return await this.selectById(id);
	}

	async loadPinnedAnnouncements() {
		let announcements = await this.selectAllEntries([
			{ key: "Approved", value: true, comparator: "EQ" },
			{ key: "Pinned", value: true, comparator: "EQ" }
		]);
		announcements.sort((a, b) => {
			return a.pinnedDate < b.pinnedDate
		});
		return announcements;
	}
	
	async togglePinned(id) {
		let announcement = await this.getAnnouncement(id);
		return await this.updateEntry(id, {
			Pinned: !announcement.pinned,
			PinnedDateTime: moment().utc().format("YYYYMMDD h:m:s A")
		})
	}

	async loadApprovedAnnouncements(offset) {
		let announcements = await this.selectEntriesFromOffset(offset, LOAD_LIMIT, {
			by: "DateCreated",
			order: "DESC"
		}, [
			{ key: "Approved", value: true, comparator: "EQ" },
			{ key: "Pinned", value: false, comparator: "EQ" }
		]);
		announcements.sort((a, b) => {
			return a.dateCreated < b.dateCreated
		});
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

	async deleteAnnouncement(id) {
		let success = await this.deleteEntry(id, false);
		return success;
	}
}

function announcementDataToEntry(data) {
	return {
		Title: data.title,
		Announcement: data.desc,
		AnnouncementType: data.type,
		Grades: arrayToString(data.grades),
		Author: data.author,
		Approved: false,
		Pinned: false,
		PinnedDateTime: moment().utc().format("YYYYMMDD h:m:s A")
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