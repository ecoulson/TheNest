const UserLayer = require('../../DataAccessLayer/UserLayer');
const MockUserModel = require('../mocks/MockUserModel');
const { expect, use } = require('chai');
const mockedEnv = require('mocked-env');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

describe("UserLayer", () => {
	let model = new MockUserModel();
	let layer = new UserLayer(model);

	beforeEach(() => {
		model = new MockUserModel();
		layer = new UserLayer(model);
	});

	describe("getOrCreateUser", () => {
		it('Should get a user', async () => {
			let user = await layer.getOrCreateUser({ id: 1});

			expect(user).to.be.deep.equal({
				id: 1,
			});
		});

		it('Should create a user', async () => {
			let user = await layer.getOrCreateUser({ id: -1});

			expect(user).to.not.be.null;
		});

		it('Should throw an error', async () => {
			model.toggleThrowMode();

			expect(layer.getOrCreateUser({ id: -1 }))
				.to.eventually.be.rejectedWith(Error);
		})
	});

	describe("getTokenBody", () => {
		it ("Should get a valid token body", () => {
			let envRestore = mockedEnv({
				MICROSOFT_CLIENT_ID: "1",
				MICROSOFT_SECRET: "foo",
				REDIRECT_URL: "foo",
			});

			let body = layer.getTokenBody("foo");

			expect(body).to.deep.equal({
				client_id: "1",
				client_secret: "foo",
				code: "foo",
				redirect_uri: "foo",
				grant_type: "authorization_code"
			});

			envRestore();
		})
	})
})