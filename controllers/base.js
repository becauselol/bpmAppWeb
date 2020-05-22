const axios = require("axios");
const endpoint = require("endpoints");

exports.getToken = async (code) => {
	const authOptions = endpoint.auth(code)
	try {
		console.log("REQUESTING TOKENS...");
		const response = await axios({
			method: "post",
			url: authOptions.url,
			data: querystring.stringify(authOptions.body),
			headers: authOptions.headers
		})
		return [response.data.access_token, response.data.refresh_token];
	} catch (err) {
		console.log(err);
	};
};

exports.getUserID = async (access) => {
	const userOptions = endpoint.user(access)
	try {
		const response = await axios({
			method: "get",
			url: userOptions.url,
			headers: userOptions.headers
		})
		return response.data.id;
	} catch (err) {
		console.log(err);
	};
};
