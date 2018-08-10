var express = require('express');
var router = express.Router();

router.get('/login/:role', function (req, res, next) {
    req.session.login(req.params.role).then(() => {
		res.json({}).status(200);;
	})
});

router.get('/logout', function (req, res, next) {
    req.session.logout().then(() => {
		res.json({});
	});
});

router.get('/', function (req, res, next){
    res.send('Current role is ' + req.session.getRole()).status(200);
});

module.exports = router;