class UserFactory {
	convertRows(rows) {
		let users = [];
		rows.forEach((row) => {
			users.push(new User(row));
		});
		return users;
	} 
}

class User {
	constructor(row) {
		this.displayName = row.getProperty("DisplayName");
		this.firstName = row.getProperty("FirstName");
		this.lastName = row.getProperty("LastName");
		this.email = row.getProperty("Email");
		this.role = row.getProperty("UserRole");
		this.id = row.getProperty("Id");
	}
}

module.exports = UserFactory;