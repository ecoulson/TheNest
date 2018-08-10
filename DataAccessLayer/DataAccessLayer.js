class DataAccessLayer {
	constructor(table, database, typeFactory) {
		this.database = database;
		this.table = table;
		this.typeFactory = typeFactory;
	}

	async getRowCount(filters) {
		let query = `SELECT COUNT(*) FROM ${this.table}`;
		if (filters.length > 0) {
			let filterQuery = filtersToSql(filters);
			query = `SELECT COUNT(*) FROM ${this.table} WHERE ${filterQuery}`;		
		}
		let rows = await this.database.query(query);
		return rows[0].data[''];
	}

	async selectById(id) {
		let rows = await this.database.query(`SELECT * FROM ${this.table} WHERE ID=${id}`);
		if (rows.length == 1) {
			return this.typeFactory.convertRows(rows)[0];
		} else {
			return null;
		}
	}

	async selectAllEntries(filters) {
		let query = buildSelectAll(this.table, filters);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows);
	}

	async selectEntriesFromOffset(offset, limit, order, filters) {
		let query = buildOffsetQuery(this.table, offset, limit, order, filters);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows);
	}

	async createEntry(entry, outputEntry) {
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
		let query = buildUpdateQuery(this.table, id, updatedProperties);
		let rows = await this.database.query(query);
		return this.typeFactory.convertRows(rows)[0];
	}

	async deleteEntry(id, outputDeletedEntry) {
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
		if (Array.isArray(filters[i])) {
			querySubstring += "( ";
			for (let j = 0; j < filters[i].length; j++) {
				querySubstring += filterToQuery(filters[i][j]);
				if (j < filters[i].length - 1) {
					querySubstring += " OR ";
				} else {
					querySubstring += " )";
				}
			}
		} else {
			querySubstring += filterToQuery(filters[i]);
		}
		if (i < filters.length - 1) {
			querySubstring += " AND ";
		}
	}
	return querySubstring
}

function filterToQuery(filter) {
	switch(filter.comparator) {
		case "EQ":
			return `${filter.key} = '${filter.value}'`;
		case "CONTAINS":
			return `CONTAINS(${filter.key}, '"${filter.value}"')`;
		case "LIKE":
			return `${filter.key} LIKE '%${filter.value}%'`;
		default:
			return "";
	}
}

function buildOffsetQuery(table, offset, limit, order, filters) {
	if (!filters) {
		return `SELECT * FROM ${table} ORDER BY ${order.by} ${order.order} OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
	} else {
		let filterQuery = filtersToSql(filters);
		return `SELECT * FROM ${table} WHERE ${filterQuery} ORDER BY ${order.by} ${order.order} OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
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