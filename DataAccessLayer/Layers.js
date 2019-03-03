const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');
const MongoDatabase = require('../DataAccessLayer/MongoDatabase');
const AnnouncementModel = require('../models/announcement');

let database = new MongoDatabase();
let announcementLayer = new AnnouncementLayer(AnnouncementModel);
let userLayer = new UserLayer(database);

module.exports = {
	connectToDatabase: async () => {
		await database.initializeDatabase();
	},
	announcementLayer: announcementLayer,
	userLayer: userLayer,
	database: database
}