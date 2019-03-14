const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	displayName: String,
	email: String,
	role: String,
	microsoftID: String
});

module.exports = mongoose.model('User', UserSchema);
