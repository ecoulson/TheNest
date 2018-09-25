const mongoose = require('mongoose');

class MongoDatabase {
	constructor() {
		this.database = null;
	}

	async initializeDatabase() {
		return new Promise((resolve, reject) => {
			mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true });
			this.database = mongoose.connection;
			this.database.on('error', (e) => {
				return reject(e);
			});
			this.database.once('open', () => {
				return resolve();
			});
		})
	}
}

module.exports = MongoDatabase;