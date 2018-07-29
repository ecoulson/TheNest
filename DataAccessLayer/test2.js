const AnnouncementLayer = require('./AnnouncementLayer');
const Database = require('./Database');
const KeyVault = require('./KeyVault');

async function main() {
	let keyVault = new KeyVault();
	let database = new Database(keyVault);
	let announcementLayer = new AnnouncementLayer(database);
	await announcementLayer.ensureConnection();
	console.log(announcement);
}
main();