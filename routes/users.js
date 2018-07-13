var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json([
	  {
		  id: 1,
		  username: "test1"
	  },
	  {
		  id: 2,
		  username: "test2"
	  }
  ]);
});

module.exports = router;
