var express = require('express');
var router = express.Router();
let Layers = require('../DataAccessLayer/Layers');
const feedback = Layers.feedbackLayer;

router.post('/positive', async (req, res, next) => {
	await feedback.incrementPositive();
	return res.json({
		success: true
	}).status(200);
});

router.post('/negative', async (req, res, next) => {
	await feedback.incrementNegative();
	return res.json({
		success: true
	}).status(200);
})

module.exports = router;