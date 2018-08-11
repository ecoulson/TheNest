var express = require('express');
var router = express.Router();

router.get('/login/:role', function (req, res, next) {
    req.session.login(req.params.role).then(() => {
		res.json({
			role: req.params.role,
			succes: true
		}).status(200);;
	})
});

router.get('/can/:action', function(req, res, next) {
	req.session.can(req.params.action).then((hasAccess) => {
		return res.json({
			success: true,
			can: hasAccess
		}).status(200);
	})
})

router.get('/logout', function (req, res, next) {
    req.session.logout().then(() => {
		res.json({
			role: "guest",
			succes: true
		});
	});
});

router.get('/', function (req, res, next){
    res.send({
		role: req.session.getRole(),
		succes: true
	}).status(200);
});

module.exports = router;