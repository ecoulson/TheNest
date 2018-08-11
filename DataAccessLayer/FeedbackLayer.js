const negative = "Update UserFeedback SET Negative = Negative + 1 Where ID=0"
const positive = "Update UserFeedback SET Positive = Positive + 1 Where ID=0";
const DataAccessLayer = require('./DataAccessLayer');

class FeedbackLayer extends DataAccessLayer {
	constructor(database) {
		super("announcements", database);
	}

	async incrementPositive() {
		await this.runQuery(positive);
		return true;
	}

	async incrementNegative() {
		await this.runQuery(negative);
		return true;
	}
}

module.exports = FeedbackLayer;