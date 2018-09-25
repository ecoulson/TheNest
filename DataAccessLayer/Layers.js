const Database = require('../DataAccessLayer/Database');
const KeyVault = require('../DataAccessLayer/KeyVault');
const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');
const MongoDatabase = require('../DataAccessLayer/MongoDatabase');

let keyVault = new KeyVault();
let database = new Database(keyVault);
let mongoDatabase = new MongoDatabase();
let announcementLayer = new AnnouncementLayer(database, mongoDatabase);
let userLayer = new UserLayer(mongoDatabase);

module.exports = {
	connectToDatabase: async () => {
		await database.ensureConnectionPoolCreated();
		await mongoDatabase.initializeDatabase();
	},
	announcementLayer: announcementLayer,
	userLayer: userLayer,
	keyVault: keyVault
}