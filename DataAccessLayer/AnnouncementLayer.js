const Announcement = require('../models/announcement');
const Counter = require('../models/counter');
const moment = require('moment');
const LOAD_LIMIT = 20;

class AnnouncementLayer {
	constructor(mongoDatabase) {
		this.mongoDatabase = mongoDatabase;
	}

	async getAnnouncementCount(filters) {
		console.log(convertFiltersToMongoQuery(filters, true, false));
		return await Announcement.count(convertFiltersToMongoQuery(filters, true, false));
	}

	async getAnnouncement(id) {
		return Announcement.findById(id);
	}

	async loadPinnedAnnouncements(filters) {
		console.log(convertFiltersToMongoQuery(filters, true, true));
		return await Announcement.find(convertFiltersToMongoQuery(filters, true, true));
	}
	
	async togglePinned(id) {
		let announcement = await Announcement.findById(id);
		announcement.pinned = !announcement.pinned;
		announcement.pinnedDate = moment().utc().format("YYYYMMDD h:m:s A");
		return await Announcement.findByIdAndUpdate(id, announcement)
	}

	async loadApprovedAnnouncements(offset, filters) {
		console.log(convertFiltersToMongoQuery(filters, true, false));
		let query = convertFiltersToMongoQuery(filters, true, false);
		return await Announcement.find(query).sort({dateCreated: -1}).limit(20);
	}

	async loadUnapprovedAnnouncements() {
		return await Announcement.find({
			approved: false
		});
	}

	async createAnnouncement(announcementData, outputEntry) {
		let announcementIDCounter = await Counter.findByIdAndUpdate("announcementID", {$inc: {value: 1}});
		let type = announcementData.type.substring(0,1).toUpperCase() + 
					announcementData.type.substring(1, announcementData.type.length);
		return await Announcement.create({
			_id: announcementIDCounter.value + 1,
			title: announcementData.title,
			desc: announcementData.desc,
			author: announcementData.author,
			grades: announcementData.grades,
			type: type,
			dateCreated: new Date(),
			approved: false,
			pinned: false,
			pinnedDate: new Date(),
		});
	}

	async approveAnnouncement(id) {
		return await Announcement.findByIdAndUpdate(id, {
			approved: true
		});
	}

	async unapproveAnnouncement(id) {
		return await Announcement.updateOne({
			_id: id
		}, {
			approved: false
		});
	}

	async rejectAnnouncement(id) {
		return await Announcement.deleteOne({
			_id: id
		});
	}

	async deleteAnnouncement(id) {
		this.rejectAnnouncement(id);
	}
}

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
	if (andQuery["$and"].length != 0) {
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

module.exports = AnnouncementLayer;