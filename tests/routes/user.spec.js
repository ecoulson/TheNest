const UserRoute = require('../../routes/user');
const MockUserLayer = require('../mocks/MockUserLayer');
const { mockReq, mockRes } = require('sinon-express-mock');
const sinonChai = require('sinon-chai');
const { use, expect } = require('chai');
const MockRequest = require('../mocks/MockRequest');
const MockSession = require('../mocks/MockSession');
const mockedEnv = require('mocked-env');

use(sinonChai);

describe('UserRoute', () => {
	let userLayer = new MockUserLayer();
	let userRoute = new UserRoute(userLayer);
	let request = mockReq();
	let response = mockRes();
	let session = new MockSession();
	let http = new MockRequest();

	beforeEach(() => {
		userLayer = new MockUserLayer();
		userRoute = new UserRoute(userLayer);
		http = new MockRequest();
		userRoute.request = http;
		request = mockReq();
		session = new MockSession();
		request.session = session;
		response = mockRes();
	})

	describe('redirectLogin', () => {
		it('should redirect login', () => {
			let envRestore = mockedEnv({
				MICROSOFT_LOGIN_URL: "foo"
			});

			userRoute.redirectLogin(request, response);

			expect(response.json).to.be.calledWith({
				location: "foo"
			});
			envRestore();
		});
	});

	describe('handleLogin', () => {
		it('should successfully login a user', async () => {
			http.queueResponse({
				access_token: "foo"
			});
			http.queueResponse({
				userPrincipalName: "foo@overlake.org"
			})
			
			request.params.code = "foo";

			await userRoute.handleLogin(request, response);

			expect(response.status).to.be.calledWith(302)
			expect(response.json).to.be.calledWith({
				success: true,
				user: { 
					id: 0, 
					username: "foo" 
				}
			})
		})

		it('should fail to login a user from a different principal', async () => {
			http.queueResponse({
				access_token: "foo"
			});
			http.queueResponse({
				userPrincipalName: "foo@bar.org"
			})
			
			request.session = new MockSession();
			request.params.code = "foo";
			
			await userRoute.handleLogin(request, response);

			expect(response.status).to.be.calledWith(302)
			expect(response.json).to.be.calledWith({
				success: false,
			})
		})
	});

	describe('getAccessToken', () => {
		it('Should access token', async () => {
			http.queueResponse({
				access_token: "foo"
			});
			request.params = {
				code: "bar"
			}

			let token = await userRoute.getAccessToken(request);

			expect(token.access_token).to.equal("foo");
		})
	});

	describe('getUserData', () => {
		it('Should get the users data', async () => {
			response.cookie = (name, value, options) => {
				expect(name).to.equal('userToken');
				expect(value).to.equal('foo');
				expect(options).to.deep.equal({ maxAge: 900000, httpOnly: true });
			};

			http.queueResponse({
				userPrincipalName: "foo@overlake.org",
				id: 0
			})

			let user = await userRoute.getUserData(response, 'foo');
			
			expect(user.userPrincipalName).to.equal('foo@overlake.org');
			expect(user.id).to.equal(0);
		});
	});

	describe('setRole', () => {
		it('Should set the role of a user', async () => {
			await userRoute.setRole(request, {
				role: "user"
			});
		});
	})

	describe('getToken', () => {
		it('Should get a token', () => {
			let token = userRoute.getToken("foo");
			expect(token).to.equal("client_id=foo&client_secret=bar&code=foo&redirect_uri=baz&grant_type=qux")
		})
	});

	describe('handlePermissionCheck', () => {
		it('Should check action and fail to access that action', () => {
			request.params = {
				actions: "foo"
			}
			userRoute.handlePermissionCheck(request, response).then(() => {
				expect(response.status).to.be.calledWith(200);
				expect(response.json).to.be.calledWith({
					success: true,
					can: false
				})
			})
		})

		it('Should check action and to access that action', () => {
			session.grantAccess();
			request.params = {
				actions: "foo"
			}
			
			return userRoute.handlePermissionCheck(request, response).then(() => {
				expect(response.status).to.be.calledWith(200);
				expect(response.json).to.be.calledWith({
					success: true,
					can: true
				})
			})
		})
	});

	describe('handleLogout', () => {
		it('Should log out of the current session', () => {
			return userRoute.handleLogout(request, response).then(() => {
				expect(response.json).to.be.calledWith({
					role: "guest",
					success: true
				})
			});
		})
	})

	describe('getRole', () => {
		it('Should log out of the current session', () => {
			userRoute.getRole(request, response);

			expect(response.json).to.be.calledWith({
				role: "foo",
				success: true
			})
		})
	})
})