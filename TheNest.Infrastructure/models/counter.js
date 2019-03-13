const mongoose = require('mongoose');
const CounterSchema = new mongoose.Schema({
	_id: String,
	value: Number
});

module.exports = mongoose.model('Counter', CounterSchema);