const DataAccessLayer = require('./DataAccessLayer');
const AnnouncementFactory = require('./AnnouncementFactory');
const Announcement = require('../models/announcement');
const moment = require('moment');
const LOAD_LIMIT = 20;

// [ [ { key: 'Announcement', value: 'c', comparator: '$regex' },
// { key: 'Title', value: 'c', comparator: '$regex' },
// { key: 'Author', value: 'c', comparator: '$regex' } ],
// { key: 'Grades', value: '11', comparator: '$in' },
// { key: 'AnnouncementType', value: 'Sports', comparator: '$eq' } ]

function convertFiltersToMongoQuery(filters, approved, pinned) {
	let andQuery = { "$and": [] };
	let orQuery = { "$or": [] };
	filters.forEach((filter) => {
		if (!Array.isArray(filter)) {
			let andComponent = {};
			let andComparator = {};
			if (filter.key.toLowerCase() == "grades") {
				andComparator[filter.comparator] = [ parseInt(filter.value) ];
			} else {
				andComparator[filter.comparator] = filter.value;	
			}
			andComponent[filter.key.toLowerCase()] = andComparator;
			andQuery["$and"].push(andComponent);
		} else {
			filter.forEach((filter) => {
				let orComponent = {};
				let orComparator = {};
				orComparator[filter.comparator] = filter.value;
				orComponent[filter.key.toLowerCase()] = orComparator;
				orQuery["$or"].push(orComponent);
			});
			andQuery["$and"].push(orQuery);
		}
	});
	if (andQuery.length == 0) {
		return {
			...andQuery,
			approved: approved,
			pinned: pinned,
		};
	} else {
		return {
			approved: approved,
			pinned: pinned,
		}
	}
}


class AnnouncementLayer extends DataAccessLayer {
	constructor(database) {
		super("announcements", database, new AnnouncementFactory());
		this.approvedOffset = 0;
		this.unapprovedOffset = 0;
	}

	async getAnnouncementCount(filters) {
		return await Announcement.count(convertFiltersToMongoQuery(filters, true, false));
	}

	async getAnnouncement(id) {
		return await this.selectById(id);
	}

	async loadPinnedAnnouncements(filters) {
		return await Announcement.find(convertFiltersToMongoQuery(filters, true, true));
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
			// ...filters,
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