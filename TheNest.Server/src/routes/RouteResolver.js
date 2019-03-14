class RouteResolver {
	constructor(name, resolver, args) {
		this.name = name;
		this.resolver = resolver;
		this.args = args;
	}

	async resolve() {
		return await this.resolver(...this.args);
	}
}

module.exports = RouteResolver;