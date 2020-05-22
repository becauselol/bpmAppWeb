exports.getAccessToken = async (code, redirect_uri, client_id, client_secret) => {
	const authOptions = options.auth(code, redirect_uri, client_id, client_secret)
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
	const userOptions = options.user(access)
	try {
		const response = await axios({
			method: "get",
			url: userOptions.url,
			headers: userOptions.headers
		})
		const userID = response.data.id;
		return userID;
	} catch (err) {
		console.log(err);
	};
};
