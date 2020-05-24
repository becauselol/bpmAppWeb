const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userID: {
		type: String,
		unique: true
	},
	accessToken: {
		type: String
	},
	refreshToken: {
		type: String
	}
})

const User = mongoose.model('User', userSchema);

module.exports = User