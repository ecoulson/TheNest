const Route = require('./route');
const RouteResolver = require('./RouteResolver');


/**
 * The announcement route handles all requests made to the /announcements path
 * This ranges from pinning announcements to creating announcements.
 */
class AnnouncementRoute extends Route {
	constructor(announcementLayer) {
		super();
		this.layer = announcementLayer;
		this.setup = this.setup.bind(this);
		this.getCount = this.getCount.bind(this);
		this.loadFromOffest = this.loadFromOffest.bind(this);
		this.getPinned = this.getPinned.bind(this);
		this.pin = this.pin.bind(this);
		this.create = this.create.bind(this);
		this.getUnapproved = this.getUnapproved.bind(this);
		this.approve = this.approve.bind(this);
		this.unapprove = this.unapprove.bind(this);
		this.reject = this.reject.bind(this);
		this.getByID = this.getByID.bind(this);
	}

	// Sets up all announcement endpoints
	setup() {
		const router = require('express').Router();
		router.get(`/`, this.getCount);
		router.get(`/load/:offset`, this.loadFromOffest);
		router.get(`/pinned`, this.getPinned);
		router.get(`/approve`, this.getUnapproved);
		router.get(`/:id`, this.getByID);
		router.post(`/`, this.create);
		router.post(`/approve/`, this.approve);
		router.post(`/reject/`, this.reject);
		router.delete(`/:id`, this.delete);
		router.put(`/pinned/:id`, this.pin);
		router.put(`/unapprove/:id`, this.unapprove);
		return router;
	}

	// gets count of total announcements in the database
	async getCount(request, response) {
		const resolver = new RouteResolver('count', this.layer.getAnnouncementCount, [ getFilters(request) ]);
		await this.handleRoute(request, response, 'Announcement:Read', resolver);
	}

	// loads a chunk announcements starting from a 
	// given offset in the request parameters
	async loadFromOffest(request, response) {
		const resolver = new RouteResolver('announcements', this.layer.loadApprovedAnnouncements, [ request.params.offset, getFilters(request) ]); 
		await this.handleRoute(request, response, 'Announcement:Read', resolver);
	}

	// gets all pinned announcements
	async getPinned(request, response) {
		const resolver = new RouteResolver('announcements', this.layer.loadPinnedAnnouncements, [ getFilters(request) ]);
		await this.handleRoute(request, response, 'Announcement:Read', resolver);
	}

	// pins an announcement with the passed id in the request parameters
	async pin(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.togglePinned, [ request.params.id ]);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// Creates an announcement from the body passed through the request
	async create(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.createAnnouncement, [ request.body ]);
		await this.handleRoute(request, response, 'Announcement:Create', resolver);
	}

	// Gets all unapproved announcements
	async getUnapproved(request, response) {
		const resolver = new RouteResolver('announcements', this.layer.loadUnapprovedAnnouncements, []);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// Approves an announcement with an id passed through the request body
	async approve(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.approveAnnouncement, [request.body._id]);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// unapproves an announcement with an ID passed through the parameters
	async unapprove(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.unapproveAnnouncement, [request.params.id]);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// rejects announcement with id in the body
	async reject(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.rejectAnnouncement, [request.body._id]);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// gets an announcement by the id passed through the request parameters
	async getByID(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.getAnnouncement, [request.params.id]);
		await this.handleRoute(request, response, 'Announcement:Read', resolver);
	}

	// Deletes an announcement with the id to be deleted in the request
	async delete(request, response) {
		const resolver = new RouteResolver('announcement', this.layer.rejectAnnouncement, [request.params.id]);
		await this.handleRoute(request, response, 'Admin', resolver);
	}

	// Handler for all announcement routes
	async handleRoute(request, response, permission, data) {
		if (await this.hasPermissionTo(request, permission)) {
			return await this.sendData(response, data)
		} else {
			return this.sendForbiddenResponse(response);
		}
	}
}

// gets filters from the request
function getFilters(request) {
	if (request.query.filters) {
		return JSON.parse(request.query.filters);
	} else {
		return [];
	}
}

module.exports = AnnouncementRoute;
