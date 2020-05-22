require("dotenv").config();
const querystring = require("querystring");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri =process.env.REDIRECT_URI;
const scope = "playlist-read-private playlist-modify-private playlist-modify-public";

exports.url = {
    playlists: `https://api.spotify.com/v1/users/${userID}/playlists`,

};

exports.auth = {
    url: "https://accounts.spotify.com/authorize?" +
	querystring.stringify({
		response_type: "code",
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
  	})
}

exports.token = (code) => {
	return {
		url: "https://accounts.spotify.com/api/token",
		body: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: "authorization_code",
		},
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(`${client_id}:${client_secret}`).toString("base64"), // client id and secret from env
		}
	}
};

exports.user = (access) => {
	return {
		url: 'https://api.spotify.com/v1/me',
		headers: { 'Authorization': 'Bearer ' + access}
	};
};

exports.playlists = (access, userID) => {
	return {
		url:`https://api.spotify.com/v1/users/${userID}/playlists`,
		headers: { 'Authorization': `Bearer ${access}` }
	};
};

exports.tracks = (access, playlistID) => {
	return {
		url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
		headers: { 'Authorization': `Bearer ${access}` },
	}
}

exports.audioFeatures = (access) => {
	return {
		url: `https://api.spotify.com/v1/audio-features`,
		headers: { 'Authorization': `Bearer ${access}` }
	}
}
