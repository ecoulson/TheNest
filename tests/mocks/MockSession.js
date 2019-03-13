class MockSession {
	constructor() {
		this.hasAccess = false;
	}

	grantAccess() {
		this.hasAccess = true;
	}

	getRole() {
		return "foo";
	}

	async login() {
		
	}

	async logout() {

	}

	async can(permission) {
		return new Promise((resolve, reject) => {
			return resolve(this.hasAccess)
		})
	}
}

module.exports = MockSession;