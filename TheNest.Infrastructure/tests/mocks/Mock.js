class Mock {
	constructor() {
		this.shouldThrow = false;
	}

	toggleThrowMode() {
		this.shouldThrow = !this.shouldThrow;
	}

	handleCall(data) {
		if (this.shouldThrow) {
			throw new Error("Error should be thrown for testing");
		} else {
			return data;
		}
	}
}

module.exports = Mock;