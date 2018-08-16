const roles = {
	"rbac": {
		"admin": {
			"can": [
				"Admin",
				"Announcement:Delete",
				"Announcement:Update"
			],
			"inherits": ["user"]
		},
		"user": {
			"can": [
				"Announcement:Create",
				{
					"name": "Announcement:Update",
					"when": function(params) {
						return params.user.id === params.announcement.id;
					}
				}
			],
			"inherits": ["guest"]
		},
		"guest": {
			"can": [
				"Announcement:Read"
			]
		}
	}
}

module.exports = roles;