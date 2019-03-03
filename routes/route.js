class Route {
	async hasPermissionTo(request, permission) {
		return await request.session.can(permission)
	}
	
	async sendData(response, resolver) {
		try {
			let body = { success: true };
			body[resolver.name] = await resolver.resolve();
			response.json(body).status(200);
		} catch (error) {
			console.log(error);
			response.json({ success: false }).status(500);
		}
	}
	
	sendForbiddenResponse(response) {
		response.json({ 
			success: false
		}).status(403);
	}
}

module.exports = Route;