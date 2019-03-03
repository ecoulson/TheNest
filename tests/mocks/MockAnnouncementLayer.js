class MockAnnouncementLayer {
	constructor() {
		this.shouldThrow = false;

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

	setErrorMode() {
		this.shouldThrow = true;
	}

	setCorrectMode() {
		this.shouldThrow = false;
	}

	async getAnnouncementCount(filters) {
		return handleCall(this.shouldThrow, 0);
	}

	async loadApprovedAnnouncements(offset, filters) {
		return handleCall(this.shouldThrow, []);
	}

	async loadPinnedAnnouncements(filters) {
		return handleCall(this.shouldThrow, []);
	}

	async togglePinned(id) {
		return handleCall(this.shouldThrow, {});
	}

	async createAnnouncement(announcement) {
		return handleCall(this.shouldThrow, {});
	}

	async loadUnapprovedAnnouncements() {
		return handleCall(this.shouldThrow, [])
	}

	async approveAnnouncement(id) {
		return handleCall(this.shouldThrow, {});
	}

	async unapproveAnnouncement(id) {
		return handleCall(this.shouldThrow, {});
	}
	
	async rejectAnnouncement(id) {
		return handleCall(this.shouldThrow, {});
	}

	async getAnnouncement(id) {
		return handleCall(this.shouldThrow, {});
	}

	async deleteAnnouncement() {
		return handleCall(this.shouldThrow, null);
	}
}

function handleCall(shouldThrow, data) {
	if (shouldThrow) {
		throw new Error("Error should be thrown for testing");
	} else {
		return data;
	}
}

module.exports = MockAnnouncementLayer;