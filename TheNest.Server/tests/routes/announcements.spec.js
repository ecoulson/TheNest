require("mocha");
const { use, expect } = require('chai');
const sinonChai = require('sinon-chai');
const { mockReq, mockRes } = require('sinon-express-mock');
const AnnouncementRoute = require('../../src/routes/announcements');
const MockSession = require('../mocks/MockSession');
const MockAnnouncementLayer = require('../mocks/MockAnnouncementLayer');

use(sinonChai);

describe('AnnouncementRoute', () => {
	let route;
	let request;
	let response;
	let announcementLayer;
	let session;

	beforeEach(() => {
		announcementLayer = new MockAnnouncementLayer();
		session = new MockSession();
		route = new AnnouncementRoute(announcementLayer);
		request = mockReq({
			session: session,
			query: {}
		});
		response = mockRes();
	})

	describe('getCount', () => {
		it('Should fail to get announcement count due to lacking permissions', async () => {
			await route.getCount(request, response);
	
			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to get announcement count due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.getCount(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should get count', async () => {
			session.grantAccess()

			await route.getCount(request, response);
	
			expect(response.json).to.be.calledWith({
				success: true,
				count: 0
			})
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('loadFromOffset', () => {
		it('Should fail to load announcements from offset due to missing permissions', async () => {
			await route.loadFromOffest(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to load announcements from offset due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.loadFromOffest(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should load from offset', async () => {
			request.params.offset = 0;
			session.grantAccess()

			await route.loadFromOffest(request, response);
	
			expect(response.json).to.be.calledWith({
				success: true,
				announcements: []
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('getPinned', () => {
		it('Should fail to get pinned announcements due to missing permissions', async () => {
			await route.getPinned(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to get pinned announcements due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.getPinned(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should get pinned announcements', async () => {
			session.grantAccess()

			await route.getPinned(request, response);
	
			expect(response.json).to.be.calledWith({
				success: true,
				announcements: []
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('pin', () => {
		it('Should fail to pin announcement due to missing permissions', async () => {
			await route.pin(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to pin announcement due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.pin(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should pin announcement', async () => {
			request.params.id = 1;

			session.grantAccess()

			await route.pin(request, response);
	
			expect(response.json).to.be.calledWith({
				success: true,
				announcement: {}
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('create', () => {
		it('Should fail to create announcement due to missing permissions', async () => {
			await route.create(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to create announcement due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.create(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should create announcement', async () => {
			request.body = {};
			session.grantAccess()

			await route.create(request, response);
	
			expect(response.json).to.be.calledWith({
				success: true,
				announcement: {}
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('getUnapproved', () => {
		it('Should fail to get unapproved announcements due to missing permissions', async () => {
			await route.getUnapproved(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to get unapproved announcements due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.getUnapproved(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should get unapproved announcements', async () => {
			session.grantAccess()

			await route.getUnapproved(request, response);
	
			expect(response.json).to.be.calledWith({
				announcements: [],
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('approve', () => {
		it('Should fail to approve announcement due to missing permissions', async () => {
			await route.approve(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to approve announcement due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.approve(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should approve announcement', async () => {
			request.params.id = 0;
			session.grantAccess();

			await route.approve(request, response);
	
			expect(response.json).to.be.calledWith({
				announcement: {},
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('unapprove', () => {
		it('Should fail to approve announcement due to missing permissions', async () => {
			await route.unapprove(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to approve announcement due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.unapprove(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should approve announcement', async () => {
			request.params.id = 0;
			session.grantAccess();

			await route.unapprove(request, response);
	
			expect(response.json).to.be.calledWith({
				announcement: {},
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('reject', () => {
		it('Should fail to reject announcement due to missing permissions', async () => {
			await route.reject(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to reject announcement due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.reject(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should reject announcement', async () => {
			request.body._id = 0;
			session.grantAccess();

			await route.reject(request, response);
	
			expect(response.json).to.be.calledWith({
				announcement: {},
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('getByID', () => {
		it('Should fail to get announcement by id due to missing permissions', async () => {
			await route.getByID(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to get announcement by id due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.getByID(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should get announcement by id', async () => {
			request.params.id = 0;
			session.grantAccess();

			await route.getByID(request, response);
	
			expect(response.json).to.be.calledWith({
				announcement: {},
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})

	describe('delete', () => {
		it('Should fail to get announcement by id due to missing permissions', async () => {
			await route.delete(request, response);

			expect(response.json).to.be.calledWith({
				success: false,
			})
			expect(response.status).to.be.calledWith(403);
		});

		it('Should fail to get announcement by id due to internal error', async () => {
			session.grantAccess();
			announcementLayer.toggleThrowMode();

			await route.delete(request, response);
			
			expect(response.json).to.be.calledWith({
				success: false,
			});
			expect(response.status).to.be.calledWith(500);
		})

		it('Should delete announcement by id', async () => {
			request.params.id = 0;
			session.grantAccess();

			await route.delete(request, response);
	
			expect(response.json).to.be.calledWith({
				announcement: {},
				success: true
			});
			expect(response.status).to.be.calledWith(200);
		})
	})
})