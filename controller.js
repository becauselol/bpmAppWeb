const axios = require("axios");
const querystring = require("querystring");
const options = require("./options.js");
const p = require("./prompting.js");
const data = require("./dataHandler.js");

const getPlaylists = async (access, userID, url) => {
	const playlistOptions = options.playlist(access, userID);
	playlistOptions.url = url;
	const result = await axios({
		method: "get",
		url: playlistOptions.url,
		headers: playlistOptions.headers
	})
	return result;
}

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

exports.playlistSelector = async (access_token, userID, nextPage = `https://api.spotify.com/v1/users/${userID}/playlists`) => {
	try {
		//get playlists
		let playlistRes = await getPlaylists(access_token, userID, nextPage);
		nextPage = playlistRes.data.next;
		let playlistNames = data.store(playlistRes.data.items);
		//prompt playlist
		const selection = await p.selectPlaylist(playlistNames);
		if (selection.selection === 'next') {
			console.log('DISPLAYING NEXT...')
			return exports.playlistSelector(access_token, userID, nextPage);
		} else {
			return selection.selection
		}
	} catch (err) {
		console.log(err);
	};
};

exports.getSongList = async (access, playlistID) => {
	const songListOptions = options.songList(access, playlistID);
	try {
		const response = await axios({
			method: "get",
			url: songListOptions.url,
			headers: songListOptions.headers
		})
		console.log(response.data.items);
	} catch (err) {
		console.log(err);
	}
}
