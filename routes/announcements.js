var express = require('express');
var router = express.Router();
let Layers = require('../DataAccessLayer/Layers');
const announcementLayer = Layers.announcementLayer;

router.get('/', async function(req, res, next) {
	let announcements = await announcementLayer.loadApprovedAnnouncements();
	return res.json(announcements);
});

router.get('/pinned', async function(req, res, next) {
	let announcements = await announcementLayer.loadPinnedAnnouncements();
	return res.json(announcements);
});

router.put('/pinned/:id', async function(req, res) {
	let announcements = await announcementLayer.togglePinned(req.params.id);
	return res.json(announcements);
})

router.post('/', async function(req, res, next) {
	let announcement = await announcementLayer.createAnnouncement(req.body, true);
	return res.send({
		success: announcement != null,
		announcement: announcement
	});
});

router.get('/approve', async function(req, res, next) {
	let announcements = await announcementLayer.loadUnapprovedAnnouncements();
	return res.json(announcements);
});

router.post('/approve/', async function(req, res, next) {
	let announcement = await announcementLayer.approveAnnouncement(req.body.id);
	return res.send({
		success: true,
		announcement: announcement
	})
});

router.put('/unapprove/:id', async function(req, res, next) {
	let announcement = await announcementLayer.unapproveAnnouncement(req.params.id);
	return res.send({
		success: true,
		announcement: announcement
	})
}) 

router.post('/reject/', async function(req, res, next) {
	let announcement = await announcementLayer.rejectAnnouncement(req.body.id);
	return res.send({
		success: true, 
		announcement: announcement
	});
});

router.get('/:id', async function(req, res, next) {
	let announcement = await announcementLayer.getAnnouncement(req.params.id);
	return res.json(announcement);
});

router.delete('/:id', async function(req, res, next) {
	let status = await announcementLayer.deleteAnnouncement(req.params.id);
	return res.json({
		success: status
	})
});

module.exports = router;
