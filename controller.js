const axios = require("axios");
const querystring = require("querystring");

exports.getAccessToken = async (code, redirect_uri, client_id, client_secret) => {
	const authOptions = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: "authorization_code",
		},
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(`${client_id}:${client_secret}`).toString("base64"), // client id and secret from env
		},
	};
	try {
		console.log("REQUESTING TOKENS...");
		const response = await axios({
			method: "post",
			url: authOptions.url,
			data: querystring.stringify(authOptions.form),
			headers: authOptions.headers
		})

		return [response.data.access_token, response.data.refresh_token];
	} catch (err) {
		console.log(err);
	};
};

exports.getUserID = async (access) => {
	const userOptions = {
		url: 'https://api.spotify.com/v1/me',
		headers: { 'Authorization': 'Bearer ' + access},
		json: true
	};
	try {
		const response = await axios({
			method: "get",
			url: userOptions.url,
			headers: userOptions.headers
		})
		const userID = response.data.id
		return userID;
	} catch (err) {
		console.log(err);
	};
};

exports.logPlaylists = async (access) => {
	const playlistOptions = {
          url: 'https://api.spotify.com/v1/users/' + userID + '/playlists' ,
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

	axios({
		method: "post",

	})
}
