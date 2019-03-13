const Mock = require('./Mock');

class MockAnnouncementLayer extends Mock {
	constructor() {
		super();

		this.getAnnouncementCount = this.getAnnouncementCount.bind(this);
		this.loadApprovedAnnouncements = this.loadApprovedAnnouncements.bind(this);
		this.loadPinnedAnnouncements = this.loadPinnedAnnouncements.bind(this);
		this.togglePinned = this.togglePinned.bind(this);
		this.createAnnouncement = this.createAnnouncement.bind(this);
		this.loadUnapprovedAnnouncements = this.loadUnapprovedAnnouncements.bind(this);
		this.approveAnnouncement = this.approveAnnouncement.bind(this);
		this.unapproveAnnouncement = this.unapproveAnnouncement.bind(this);
		this.rejectAnnouncement = this.rejectAnnouncement.bind(this);
		this.getAnnouncement = this.getAnnouncement.bind(this);
		this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
	}

	async getAnnouncementCount(filters) {
		return this.handleCall(0);
	}

	async loadApprovedAnnouncements(offset, filters) {
		return this.handleCall([]);
	}

	async loadPinnedAnnouncements(filters) {
		return this.handleCall([]);
	}

	async togglePinned(id) {
		return this.handleCall({});
	}

	async createAnnouncement(announcement) {
		return this.handleCall({});
	}

	async loadUnapprovedAnnouncements() {
		return this.handleCall([])
	}

	async approveAnnouncement(id) {
		return this.handleCall({});
	}

	async unapproveAnnouncement(id) {
		return this.handleCall({});
	}
	
	async rejectAnnouncement(id) {
		return this.handleCall({});
	}

	async getAnnouncement(id) {
		return this.handleCall({});
	}

	async deleteAnnouncement() {
		return this.handleCall({});
	}
}

module.exports = MockAnnouncementLayer;