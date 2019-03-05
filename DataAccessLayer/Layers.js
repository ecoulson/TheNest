const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');
const MongoDatabase = require('../DataAccessLayer/MongoDatabase');
const AnnouncementModel = require('../models/announcement');
const CounterModel = require('../models/counter');

let database = new MongoDatabase();

async function connectToDatabase() {
	await database.initializeDatabase();
}

module.exports = {
	connectToDatabase: connectToDatabase,
	announcementLayer: new AnnouncementLayer(AnnouncementModel, CounterModel),
	userLayer: new UserLayer(database),
	database: database
}