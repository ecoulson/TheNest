const Database = require('../DataAccessLayer/Database');
const KeyVault = require('../DataAccessLayer/KeyVault');
const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const UserLayer = require('../DataAccessLayer/UserLayer');

let keyVault = new KeyVault();
let database = new Database(keyVault);
let announcementLayer = new AnnouncementLayer(database);
let userLayer = new UserLayer();

module.exports = {
	connectToDatabase: async () => {
		await database.ensureConnectionPoolCreated()
	},
	announcementLayer: announcementLayer,
	userLayer: userLayer,
	keyVault: keyVault
}