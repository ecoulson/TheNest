var express = require('express');
const AnnouncementLayer = require('../DataAccessLayer/AnnouncementLayer');
const Database = require('../DataAccessLayer/Database');
const KeyVault = require('../DataAccessLayer/KeyVault');

var router = express.Router();
let keyVault = new KeyVault();
let database = new Database(keyVault);
let announcementLayer = new AnnouncementLayer(database);

router.get('/', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcements = await announcementLayer.loadApprovedAnnouncements();
	return res.json(announcements);
});

router.post('/', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcement = await announcementLayer.createAnnouncement(req.body);
	return res.send({
		success: announcement != null,
		announcement: announcement
	});
});

router.get('/approve', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcements = await announcementLayer.loadUnapprovedAnnouncements();
	return res.json(announcements);
});

router.post('/approve/', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcement = await announcementLayer.approveAnnouncement(req.body.id, {
		Approved: true
	});
	return res.send({
		success: true,
		announcement: announcement
	})
});

router.post('/reject/', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcement = await announcementLayer.rejectAnnouncement(req.body.id);
	return res.send({
		success: true, 
		announcement: announcement
	});
});

router.get('/:id', async function(req, res, next) {
	await announcementLayer.ensureConnection();
	let announcement = await announcementLayer.getAnnouncement(req.params.id);
	return res.json(announcement);
});

module.exports = router;
