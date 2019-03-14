const path = require('path');
require('dotenv').config({
	path: path.join(__dirname, '..', '..', '..', '.env')
});
const mongoose = require('mongoose');

class MongoDatabase {
	constructor() {
		this.database = null;
	}

	async initializeDatabase() {
		this.database = await getDatabaseConnection();
	}
}

async function getDatabaseConnection() {
	return new Promise((resolve, reject) => {
		mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true });
		let database = mongoose.connection;
		database.on('error', (e) => {
			return reject(e);
		});
		database.once('open', () => {
			return resolve(database);
		});
	})
}

module.exports = MongoDatabase;