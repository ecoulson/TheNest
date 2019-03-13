const { expect } = require('chai');
const MongoQueryBuilder = require('../../DataAccessLayer/MongoQueryBuilder');

describe('MongoQuery', () => {
	describe('getQueryFromFilters', () => {
		it('Should convert filters to empty query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([], {});

			expect(query).to.deep.equal({})
		})

		it('Should convert options to simple query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([], {
				a: true
			});

			expect(query).to.deep.equal({
				a: true
			})
		})

		it('Should convert filters to and query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([
				{
					key: "baz",
					comparator: "bar",
					value: "foo"
				}
			]);

			
			expect(query).to.deep.equal({
				$and: [
					{
						baz: {
							bar: "foo"
						}
					}
				]
			})
		})

		it('Should convert filters to or query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([
				[
					{
						key: "baz",
						comparator: "bar",
						value: "foo"
					}
				]
			]);

			
			expect(query).to.deep.equal({
				$and: [
					{
						$or: [
							{
								baz: {
									bar: new RegExp("foo","i")
								}
							}
						]
					}
				]
			})
		})

		it('Should convert multiple filters to or query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([
				[
					{
						key: "baz",
						comparator: "bar",
						value: "foo"
					},
					{
						key: "baz2",
						comparator: "bar2",
						value: "foo2"
					}
				]
			]);

			
			expect(query).to.deep.equal({
				$and: [
					{
						$or: [
							{
								baz: {
									bar: new RegExp("foo","i")
								}
							},
							{
								baz2: {
									bar2: new RegExp("foo2","i")
								}
							}
						]
					}
				]
			})
		})

		it('Should convert multiple filters to combined query', () => {
			let query = MongoQueryBuilder.buildQueryFromFilters([
				[
					{
						key: "baz",
						comparator: "bar",
						value: "foo"
					},
				],
				{
					key: "baz2",
					comparator: "bar2",
					value: "foo2"
				}
			]);

			
			expect(query).to.deep.equal({
				$and: [
					{
						$or: [
							{
								baz: {
									bar: new RegExp("foo","i")
								}
							},
						],
					},
					{
						baz2: {
							bar2: "foo2"
						}
					}
				],
			})
		})
	})
})