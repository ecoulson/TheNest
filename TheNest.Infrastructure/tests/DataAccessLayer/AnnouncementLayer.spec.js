const AnnouncementLayer = require('../../DataAccessLayer/AnnouncementLayer');
const MockAnnouncementModel = require('../mocks/MockAnnouncementModel');
const MockCounterModel = require('../mocks/MockCounterModel');
const { expect, use } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

describe('AnnouncementLayer', () => {
	let model = new MockAnnouncementModel();
	let counter = new MockCounterModel();
	let layer = new AnnouncementLayer();

	beforeEach(() => {
		model = new MockAnnouncementModel();
		counter = new MockCounterModel();
		layer = new AnnouncementLayer(model, counter);
	})

	describe('getAnnouncementCount', () => {
		it('Should get count', async () => {
			let count = await layer.getAnnouncementCount([]);
	
			expect(count).to.be.equal(0);
		});

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.getAnnouncementCount([]))
				.to.eventually.be.rejectedWith(Error)
		});
	});

	describe('getAnnouncement', () => {
		it('Should get announcement', async () => {
			let announcement = await layer.getAnnouncement(0);

			expect(announcement).to.be.deep.equal({
				id: 0
			})
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.getAnnouncement(1))
				.to.eventually.be.rejectedWith(Error)
		});
	});

	describe('togglePinned', () => {
		it('Should toggle pin', async () => {
			let announcement = await layer.togglePinned(0);

			expect(announcement).to.be.deep.equal({
				id: 0
			});
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.togglePinned(0))
				.to.eventually.be.rejectedWith(Error)
		});
	})

	describe('createAnnouncement', () => {
		it('Should create announcement', async () => {
			let announcement = await layer.createAnnouncement({
				type: "foo"
			});

			expect(announcement).to.be.deep.equal({
				id: 1,
				type: "Foo"
			});
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.togglePinned(0))
				.to.eventually.be.rejectedWith(Error)
		});
	})

	describe('approveAnnouncement', () => {
		it('Should create announcement', async () => {
			let announcement = await layer.approveAnnouncement(0);

			expect(announcement).to.be.deep.equal({
				id: 0
			});
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.togglePinned(0))
				.to.eventually.be.rejectedWith(Error)
		});
	})

	describe('approveAnnouncement', () => {
		it('Should create announcement', async () => {
			let announcement = await layer.unapproveAnnouncement(0);

			expect(announcement).to.be.deep.equal({
				id: 0
			});
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.togglePinned(0))
				.to.eventually.be.rejectedWith(Error)
		});
	});

	describe('rejectAnnouncement', () => {
		it('Should create announcement', async () => {
			let announcement = await layer.rejectAnnouncement(0);

			expect(announcement).to.be.deep.equal({});
		})

		it('Should throw an exception', () => {
			model.toggleThrowMode();

			return expect(layer.togglePinned(0))
				.to.eventually.be.rejectedWith(Error)
		});
	})
})