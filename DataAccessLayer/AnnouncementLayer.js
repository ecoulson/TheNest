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

	async getAnnouncementCount(filters) {
		return await this.getRowCount([
			...filters,
			{ key: "Approved", value: true, comparator: "EQ" },
			{ key: "Pinned", value: false, comparator: "EQ" }
		]);
	}

	async getAnnouncement(id) {
		return await this.selectById(id);
	}

	async loadPinnedAnnouncements(filters) {
		let announcements = await this.selectAllEntries([
			...filters,
			{ key: "Approved", value: true, comparator: "EQ" },
			{ key: "Pinned", value: true, comparator: "EQ" }
		]);
		return announcements;
	}
	
	async togglePinned(id) {
		let announcement = await this.getAnnouncement(id);
		return await this.updateEntry(id, {
			Pinned: !announcement.pinned,
			PinnedDate: moment().utc().format("YYYYMMDD h:m:s A")
		})
	}

	async loadApprovedAnnouncements(offset, filters) {
		let announcements = await this.selectEntriesFromOffset(offset, LOAD_LIMIT, {
			by: "DateCreated",
			order: "DESC"
		}, [
			...filters,
			{ key: "Approved", value: true, comparator: "EQ" },
			{ key: "Pinned", value: false, comparator: "EQ" }
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
		Grades: arrayToString(data.grades.sort()),
		Author: data.author,
		Approved: false,
		Pinned: false,
		PinnedDate: moment().utc().format("YYYYMMDD h:m:s A")
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