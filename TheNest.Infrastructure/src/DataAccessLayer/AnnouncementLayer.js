const moment = require('moment');
const LOAD_LIMIT = 20;
const MongoQuery = require('./MongoQueryBuilder');
const AnnouncmentDTO = require('./Announcement');

class AnnouncementLayer {
	constructor(announcement, counter) {
		this.announcement = announcement;
		this.counter = counter;

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
	}

	async getAnnouncementCount(filters) {
		return await this.announcement.countDocuments(MongoQuery.buildQueryFromFilters(filters, {
			approved: true,
			pinned: false
		}));
	}

	async getAnnouncement(id) {
		return await this.announcement.findById(id);
	}

	async loadPinnedAnnouncements(filters) {
		return await this.announcement.find(MongoQuery.buildQueryFromFilters(filters, {
			approved: true,
			pinned: true
		}));
	}
	
	async togglePinned(id) {
		let announcement = await this.announcement.findById(id);
		announcement.pinned = !announcement.pinned;
		announcement.pinnedDate = moment().utc().format("YYYYMMDD h:m:s A");
		return await this.announcement.findByIdAndUpdate(id, announcement)
	}

	async loadApprovedAnnouncements(offset, filters) {
		let query = MongoQuery.buildQueryFromFilters(filters, {
			approved: true,
			pinned: false
		});
		let announcements = await this.announcement.find(query)
									.skip(parseInt(offset))
									.sort({dateCreated: -1})
									.limit(LOAD_LIMIT);
		return announcements;
	}

	async loadUnapprovedAnnouncements() {
		return await this.announcement.find({
			approved: false
		});
	}

	async createAnnouncement(requestBody) {
		let id = await this.counter.findByIdAndUpdate("announcementID", {
			$inc: {value: 1}
		});
		console.log(id);
		return await this.announcement.create(new AnnouncmentDTO(requestBody, id.value + 1));
	}

	async approveAnnouncement(id) {
		return await this.announcement.findByIdAndUpdate(id, {
			approved: true
		});
	}

	async unapproveAnnouncement(id) {
		return await this.announcement.updateOne({
			_id: id
		}, {
			approved: false
		});
	}

	async rejectAnnouncement(id) {
		return await this.announcement.deleteOne({
			_id: id
		});
	}
}

module.exports = AnnouncementLayer;