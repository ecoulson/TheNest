const Database = require('../DataAccessLayer/Database');
const KeyVault = require('../DataAccessLayer/KeyVault');
const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const FeedbackLayer = require('../DataAccessLayer/FeedbackLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');

let keyVault = new KeyVault();
let database = new Database(keyVault);
let announcementLayer = new AnnouncementLayer(database);
let feedbackLayer = new FeedbackLayer(database);
let userLayer = new UserLayer(database);

module.exports = {
	connectToDatabase: async () => {
		await database.ensureConnectionPoolCreated()
	},
	announcementLayer: announcementLayer,
	feedbackLayer: feedbackLayer,
	userLayer: userLayer,
	keyVault: keyVault
}