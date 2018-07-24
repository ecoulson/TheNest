var express = require('express');
var router = express.Router();
let id = 0;

const db = {
	announcements: {
	}
}

router.get('/', function(req, res, next) {
	let results = query("announcements", { approved: true }, "dateCreated");
	let announcements = asList(results);
	return res.json(announcements);
});

router.post('/', function(req, res, next) {
	req.body.approved = false;
	store("announcements", req.body);
	return res.send({
		success: true,
		announcement: getEntry("announcements", id - 1)
	});
});

router.get('/approve', function(req, res, next) {
	let results = query("announcements", { approved: false });
	return res.json(results);
});

router.post('/approve/', function(req, res, next) {
	let entry = getEntry("announcements", req.body.id);
	entry.approved = true;
	update("announcements", entry.id, entry);
	return res.send({
		success: true,
		announcement: entry
	})
});

router.post('/reject/', function(req, res, next) {
	remove("announcements", req.body.id);
	return res.send({
		success: true, 
	})
})

function store(table, body) {
	body.id = id;
	db[table][id++] = body;
}

function getEntry(table, id) {
	return db[table][id];
}

function query(tableName, conditions, orderBy) {
	let table = db[tableName];
	let results = [];
	for (let id in table) {
		let announcement = table[id];
		if (matchesQuery(announcement, conditions)) {
			results.push(announcement);
		}
	}
	results.sort((a, b) => {
		return a[orderBy] < b[orderBy];
	})
	return results;
}

function matchesQuery(announcement, conditions) {
	for (let key in conditions) {
		if (announcement[key] != conditions[key]) {
			return false;
		}
	}
	return true;
}

function update(table, id, data) {
	return db[table][id] = data;
}

function remove(table, id) {
	delete db[table][id];
}

function asList(map) {
	let list = [];
	for (let key in map) {
		list.push(map[key]);
	}
	return list;
}

module.exports = router;
