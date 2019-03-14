const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');
const MongoDatabase = require('../DataAccessLayer/MongoDatabase');
const AnnouncementModel = require('../models/announcement');
const CounterModel = require('../models/counter');
const UserModel = require('../models/user');
const Database = new MongoDatabase();

module.exports = {
	Database: Database,
	Announcement: new AnnouncementLayer(AnnouncementModel, CounterModel),
	User: new UserLayer(UserModel),
}