const Counter = require('../models/counter');
const moment = require('moment');
const LOAD_LIMIT = 20;

class AnnouncementLayer {
	constructor(model) {
		this.model = model;

		this.getAnnouncementCount = this.getAnnouncementCount.bind(this);
		this.getAnnouncement = this.getAnnouncement.bind(this);
		this.loadPinnedAnnouncements = this.loadPinnedAnnouncements.bind(this);
		this.togglePinned = this.togglePinned.bind(this);
		this.loadApprovedAnnouncements = this.loadApprovedAnnouncements.bind(this);
		this.loadUnapprovedAnnouncements = this.loadUnapprovedAnnouncements.bind(this);
		this.createAnnouncement = this.createAnnouncement.bind(this);
		this.approveAnnouncement = this.approveAnnouncement.bind(this);
		this.unapproveAnnouncement = this.unapproveAnnouncement.bind(this);
		this.rejectAnnouncement = this.rejectAnnouncement.bind(this);
		this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
	}

	async getAnnouncementCount(filters) {
		return await this.model.count(this.getMongoQuery(filters, true, false));
	}

	async getAnnouncement(id) {
		return await this.model.findById(id);
	}

	async loadPinnedAnnouncements(filters) {
		return await this.model.find(this.getMongoQuery(filters, true, true));
	}
	
	async togglePinned(id) {
		let announcement = await this.model.findById(id);
		announcement.pinned = !announcement.pinned;
		announcement.pinnedDate = moment().utc().format("YYYYMMDD h:m:s A");
		return await this.model.findByIdAndUpdate(id, announcement)
	}

	async loadApprovedAnnouncements(offset, filters) {
		let query = this.getMongoQuery(filters, true, false);
		let announcements = await this.model.find(query)
									.skip(parseInt(offset))
									.sort({dateCreated: -1})
									.limit(LOAD_LIMIT);
		return announcements;
	}

	async loadUnapprovedAnnouncements() {
		return await this.model.find({
			approved: false
		});
	}

	async createAnnouncement(announcementData) {
		let announcementIDCounter = await Counter.findByIdAndUpdate("announcementID", {$inc: {value: 1}});
		let type = announcementData.type.substring(0,1).toUpperCase() + 
					announcementData.type.substring(1, announcementData.type.length);
		return await this.model.create({
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
		return await this.model.findByIdAndUpdate(id, {
			approved: true
		});
	}

	async unapproveAnnouncement(id) {
		return await this.model.updateOne({
			_id: id
		}, {
			approved: false
		});
	}

	async rejectAnnouncement(id) {
		return await this.model.deleteOne({
			_id: id
		});
	}

	async deleteAnnouncement(id) {
		this.rejectAnnouncement(id);
	}

	getMongoQuery(filters, approved, pinned) {
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
					orComparator[filter.comparator] = new RegExp(`${filter.value}`, "i");
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
}

module.exports = AnnouncementLayer;