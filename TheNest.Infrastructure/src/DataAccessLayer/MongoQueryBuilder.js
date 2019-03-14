class MongoQueryBuilder {
	static buildQueryFromFilters(filters, options) {
		const andQuery = { "$and": [] };
		filters.forEach((filter) => {
			if (isAndFilter(filter)) {
				andQuery["$and"].push(getAndComponent(filter));
			} else {
				andQuery["$and"].push(getOrComponent(filter));
			}
		});
		let simpleQuery = options !== null ? options : {};
		let complexQuery = canSpreadAndQuery(andQuery) ? {...andQuery} : {}
		return {
			...complexQuery	,
			...simpleQuery
		}
	}
}

function isAndFilter(filter) {
	return !Array.isArray(filter);
}

function getAndComponent(andFilter) {
	let andComponent = {};
	let andComparator = {};
	andComparator[andFilter.comparator] = andFilter.value;	
	andComponent[andFilter.key.toLowerCase()] = andComparator;
	return andComponent;
}

function getOrComponent(orFilters) {
	const orQuery = { "$or": [] };
	orFilters.forEach((orFilter) => {
		let orComponent = {};
		let orComparator = {};
		orComparator[orFilter.comparator] = new RegExp(`${orFilter.value}`, "i");
		orComponent[orFilter.key.toLowerCase()] = orComparator;
		orQuery["$or"].push(orComponent);
	});
	return orQuery;
}

function canSpreadAndQuery(andQuery) {
	return andQuery["$and"].length != 0
}

module.exports = MongoQueryBuilder;