var express = require('express');
var router = express.Router();
let Layers = require('../DataAccessLayer/Layers');
const announcementLayer = Layers.announcementLayer;

router.get('/', async function(req, res, next) {
	req.session.can('Announcement:Read').then(async (hasAccess) => {
		if (hasAccess) {
			let filters = [];
			if (req.query.filters) {
				filters = JSON.parse(req.query.filters);
			}
			let count = await announcementLayer.getAnnouncementCount(filters);
			return res.json({
				success: true,
				count: count
			}).status(200)
		} else {
			return res.json({
				success:false,
			}).status(403);
		}
	})
})

router.get('/load/:offset', async function(req, res, next) {
	req.session.can('Announcement:Read').then(async (hasAccess) => {
		if (hasAccess) {
			let filters = [];
			if (req.query.filters) {
				filters = JSON.parse(req.query.filters);
			}
			let announcements = await announcementLayer.loadApprovedAnnouncements(req.params.offset, filters);
			return res.json(announcements).status(200);
		} else {
			return res.json({
				success:false,
			}).status(403);
		}
	});
});

router.get('/pinned', async function(req, res, next) {
	req.session.can('Announcement:Read').then(async (hasAccess) => {
		if (hasAccess) {
			let filters = [];
			if (req.query.filters) {
				filters = JSON.parse(req.query.filters);
			}
			let announcements = await announcementLayer.loadPinnedAnnouncements(filters);
			return res.json(announcements).status(200);
		} else {
			return res.json({
				success:false,
			}).status(403);
		}
	});
});

router.put('/pinned/:id', async function(req, res) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.togglePinned(req.params.id);
			return res.json({
				announcement: announcement,
				success: true
			}).status(200);
		} else {
			return res.json({
				announcement: null,
				success: false
			}).status(403);
		}
	});
})

router.post('/', async function(req, res, next) {
	req.session.can('Announcement:Create').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.createAnnouncement(req.body, true);
			return res.send({
				success: announcement != null,
				announcement: announcement
			}).status(200);
		} else {
			return res.json({
				success:false,
				announcement: null
			}).status(403);
		}
	})
});

router.get('/approve', async function(req, res, next) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			let announcements = await announcementLayer.loadUnapprovedAnnouncements();
			return res.json({
				announcements: announcements,
				success: true,
			}).status(200);
		} else {
			return res.json({
				success:false,
				announcements: []
			}).status(403);
		}
	});
});

router.post('/approve/', async function(req, res, next) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.approveAnnouncement(req.body._id);
			return res.json({
				success: true,
				announcement: announcement
			}).status(200);
		} else {
			return res.json({
				success: false,
				announcement: null
			}).status(403);
		}
	});
});

router.put('/unapprove/:id', async function(req, res, next) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.unapproveAnnouncement(req.params.id);
			return res.json({
				success: true,
				announcement: announcement
			}).status(200);
		} else {
			return res.json({
				success: false,
				announcement: null
			}).status(403);
		}
	})
}) 

router.post('/reject/', async function(req, res, next) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.rejectAnnouncement(req.body._id);
			return res.send({
				success: true, 
				announcement: announcement
			}).status(200);
		} else {
			return res.json({
				success: false,
				announcement: null
			}).status(403);
		}
	});
});

router.get('/:id', async function(req, res, next) {
	req.session.can('Announcement:Read').then(async (hasAccess) => {
		if (hasAccess) {
			let announcement = await announcementLayer.getAnnouncement(req.params.id);
			return res.json({
				success: true,
				announcement: announcement
			}).status(200);
		} else {
			return res.json({
				success: false,
				announcement: null
			}).status(403);
		}
	});
});

router.delete('/:id', async function(req, res, next) {
	req.session.can('Admin').then(async (hasAccess) => {
		if (hasAccess) {
			await announcementLayer.deleteAnnouncement(req.params.id);
			return res.json({
				success: true
			}).status(200);
		} else {
			return res.json({
				success: false,
			}).status(403);
		}
	});
});

module.exports = router;
