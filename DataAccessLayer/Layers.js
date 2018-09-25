const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');
const MongoDatabase = require('../DataAccessLayer/MongoDatabase');

let database = new MongoDatabase();
let announcementLayer = new AnnouncementLayer(database);
let userLayer = new UserLayer(database);

module.exports = {
	connectToDatabase: async () => {
		await database.initializeDatabase();
	},
	announcementLayer: announcementLayer,
	userLayer: userLayer,
	database: database
}