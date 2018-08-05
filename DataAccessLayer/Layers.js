const Database = require('../DataAccessLayer/Database');
const KeyVault = require('../DataAccessLayer/KeyVault');
const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');

let keyVault = new KeyVault();
let database = new Database(keyVault);
let announcementLayer = new AnnouncementLayer(database);

module.exports = {
	connectToDatabase: async () => {
		await database.connect();
	},
	announcementLayer: announcementLayer
}