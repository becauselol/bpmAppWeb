
exports.auth = (code, redirect_uri, client_id, client_secret) => {
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

exports.playlist = (access, userID) => {
	return {
		headers: { 'Authorization': `Bearer ${access}` }
	};
};

exports.songList = (access, playlistID) => {
	return {
		url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
		headers: { 'Authorization': `Bearer ${access}` },
	}
}
