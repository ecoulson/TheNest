const Mock = require('./Mock');

class MockAnnouncementModel extends Mock {
	constructor() {
		super();
	}

	async countDocuments() {
		return this.handleCall(0);
	}

	async findById(id) {
		return this.handleCall({
			id: id
		})
	} 

	async find(filter) {
		return this.handleCall([]);
	}

	async findByIdAndUpdate(id, announcement) {
		return this.handleCall({
			id: id
		});
	}

	async create(data) {
		return this.handleCall({
			id: data._id,
			type: data.type
		});
	}

	async updateOne(id) {
		return this.handleCall({
			id: id._id
		})
	}

	async deleteOne() {
		return this.handleCall({});
	}
}

module.exports = MockAnnouncementModel;