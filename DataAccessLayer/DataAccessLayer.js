class DataAccessLayer {
	constructor(table, database, typeFactory) {
		this.database = database;
		this.table = table;
		this.typeFactory = typeFactory;
	}

	async ensureConnection() {
		if (!this.database.connected) {
			await this.database.connect();
		}
	}

	async selectById(id) {
		await this.ensureConnection();
		let rows = await this.database.query(`SELECT * FROM ${this.table} WHERE ID=${id}`);
		if (rows.length == 1) {
			return this.typeFactory.convertRows(rows)[0];
		} else {
			return null;
		}
	}

	async selectAllEntries(filters) {
		await this.ensureConnection();
		let query = buildSelectAll(this.table, filters);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows);
	}

	async selectEntriesFromOffset(offset, limit, filters) {
		await this.ensureConnection();
		let query = buildOffsetQuery(this.table, offset, limit, filters);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows);
	}

	async createEntry(entry, outputEntry) {
		await this.ensureConnection();
		let query = buildCreateQuery(this.table, entry, outputEntry);
		try {
			if (!outputEntry) {
				await this.database.query(query);
				return true;
			} else {
				let row = await this.database.query(query);
				return this.typeFactory.convertRows(row)[0];
			}
		} catch (e) {
			return false;
		}
	}

	async updateEntry(id, updatedProperties) {
		await this.ensureConnection();
		let query = buildUpdateQuery(this.table, id, updatedProperties);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows)[0];
	}

	async deleteEntry(id, outputDeletedEntry) {
		await this.ensureConnection();
		let query = buildDeleteQuery(this.table, id, outputDeletedEntry);
		if (!outputDeletedEntry) {
			await this.database.query(query);
			return true; 
		} else {
			let rows = await this.database.query(query);
			return this.typeFactory.convertRows(rows);
		}
	}
}

function buildSelectAll(table, filters) {
	if (!filters) {
		return `SELECT * FROM ${table}`;
	} else {
		let filterQuery = filtersToSql(filters);
		return `SELECT * FROM ${table} WHERE ${filterQuery}`;
	}
}

function filtersToSql(filters) {
	let querySubstring = "";
	for (let i = 0; i < filters.length; i++) {
		querySubstring += `${filters[i].key} ${comparatorToString(filters[i].comparator)} '${filters[i].value}'`;
		if (i < filters.length - 1) {
			querySubstring += " AND ";
		}
	}
	return querySubstring
}

function comparatorToString(comparator) {
	switch(comparator) {
		case "EQ":
			return "=";
		default:
			return "";
	}
}

function buildOffsetQuery(table, offset, limit, filters) {
	if (!filters) {
		return `SELECT * FROM ${table} WHERE ID >= ${offset} AND ID < ${offset} + ${limit}`;
	} else {
		let filterQuery = filtersToSql(filters);
		return `SELECT * FROM ${table} WHERE ID >= ${offset} AND ID < ${offset} + ${limit} AND ${filterQuery}`;
	}
}

function buildCreateQuery(table, entry, outputEntry) {
	if (!outputEntry) {
		return `INSERT INTO ${table} (${keysToString(entry)}) VALUES (${valuesToString(entry)})`
	} else {
		return `INSERT INTO ${table} (${keysToString(entry)}) OUTPUT Inserted.* VALUES (${valuesToString(entry)})`
	}
}

function keysToString(entry) {
	let keys = Object.keys(entry);
	let string = "";
	for (let i = 0; i < keys.length; i++) {
		string += keys[i];
		if (i < keys.length - 1) {
			string += ", ";
		}
	}
	return string;
}

function valuesToString(entry) {
	let string = "";
	let keys = Object.keys(entry);
	for (let i = 0; i < keys.length; i++) {
		string += `'${entry[keys[i]]}'`;
		if (i < keys.length - 1) {
			string += ", ";
		}
	}
	return string;
}

function buildDeleteQuery(table, id, outputDeltedEntry) {
	if (!outputDeltedEntry) {
		return `DELETE FROM ${table} WHERE ID = ${id}`
	} else {
		return `DELETE FROM ${table} OUTPUT DELETED.* WHERE ID = ${id}`
	}
}

function buildUpdateQuery(table, id, properties) {
	let propertyQuery = buildPropertyQuery(properties);
	return `UPDATE ${table} SET ${propertyQuery} OUTPUT Inserted.* WHERE ID = ${id}`;
}

function buildPropertyQuery(properties) {
	let keys = Object.keys(properties);
	let string = "";
	for (let i = 0; i < keys.length; i++) {
		string += `${keys[i]} = '${properties[keys[i]]}'`;
		if (i < keys.length - 1) {
			string += ", ";
		}
	}
	return string;
}

module.exports = DataAccessLayer;