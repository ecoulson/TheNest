const mongoose = require('mongoose');
const AnnouncementSchema = new mongoose.Schema({
	title: String,
	type: String,
	grades: [Number],
	desc: String,
	author: String,
	dateCreated: Date,
	approved: Boolean,
	pinned: Boolean,
	pinnedDate: Date
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
