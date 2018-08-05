const ConnectionStringKey = "OverlakeASBAppDatabaseConnectionString";
const ConnectionStringVersion = "dbbf9e20d4d24832845fcbf0bf47158d"
let Connection = require('tedious').Connection;
let Request = require("tedious").Request;

class Database {
	constructor(keyVault) {
		this.keyVaultClient = keyVault.getClient();
		this.uri = keyVault.getVaultUri();
		this.connected = false;
	}

	async connect() {
		let connectionString = await getDatabaseConnectionString(this.uri, this.keyVaultClient);
		this.config = parseConnectionString(connectionString);
		this.connection = new Connection(this.config);
		addEndListener(this.connection);
		await waitForConnection(this.connection);
		this.connected = true;
		console.log("connected");
	}

	async query(queryString) {
		return new Promise(async (resolve, reject) => {
			let request = new Request(queryString, function(err) {
				if (err) {
					return reject(err);
				}
			});
			let rows = await exectueQuery(request, this.connection);
			return resolve(rows);
		}); 
	}
}

async function getDatabaseConnectionString(uri, keyVaultClient) {
	let secret = await keyVaultClient.getSecret(uri, ConnectionStringKey, ConnectionStringVersion);
	return secret.value;
}

function parseConnectionString(string) {
	let parts = string.split(';');
	parts.pop();
	let mapping = {};
	for (let i = 0; i < parts.length; i++) {
		parts[i] = parts[i].toLowerCase()[0] + parts[i].substring(1, parts[i].length);
		while (parts[i].indexOf(" ") != -1) {
			parts[i] = parts[i].replace(" ", "");
		}
		let pair = parts[i].split('=');
		mapping[pair[0]] = pair[1];
	}
	mapping['server'] = mapping['server'].split(',');
	return {
		userName: mapping['userID'],
		password: mapping['password'],
		server: mapping['server'][0].replace("tcp:", ""),
		options: {
			encrypt: true,
			database: mapping['initialCatalog'],
			connectTimeout: mapping['connectionTimeout'] * 1000
		}
	}
}

function waitForConnection(connection) {
	return new Promise((resolve, reject) => {
		connection.on('connect', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

async function exectueQuery(request, connection) {
	return new Promise((resolve, reject) => {
		let rows = [];
		request.on('row', function(columns) {
			let row = new Row();
			columns.forEach(function(column) {
				if (column.value !== null) {
					let value = column.value;
					let id = column.metadata.colName;
					row.addData(id, value);
				}
			});
			rows.push(row);
		});

		request.on('requestCompleted', function() {
			resolve(rows);
		});
		connection.execSql(request);
	});
}

function addEndListener(connection) {
	connection.on('end', () => {
		this.connected = false;
	})
}

class Row {
	constructor() {
		this.data = {};
	}

	addData(key, value) {
		this.data[key] = value;
	}

	getProperty(prop) {
		return this.data[prop];
	}
}

module.exports = Database;