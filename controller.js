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
		nextPage = playlistRes.data.next || null;
		prevPage = playlistRes.data.previous || null
		let playlistNames = data.store(playlistRes.data.items);
		//prompt playlist
		const selection = await p.selectPlaylist(playlistNames, prevPage, nextPage);
		if (selection.selection === 'next') {
			console.log('DISPLAYING NEXT...')
			return exports.playlistSelector(access_token, userID, nextPage);
		} else if (selection.selection === 'prev') {
			console.log('DISPLAYING PREV...')
			return exports.playlistSelector(access_token, userID, prevPage)
		} else {
			return selection.selection
		}
	} catch (err) {
		console.log(err);
	};
};

exports.getURIandTempo = async (access, songIDs) => { //maximum limit 100 songs
	const tempoAndID = [];
	const featureOptions = options.audioFeatures(access)
	const count = Math.ceil(songIDs.length / 100);
	for (i = 0; i < count; i++) {
		try {
			const response = await axios ({
				method: "get",
				url: featureOptions.url,
				headers: featureOptions.headers,
				params: {
					ids: songIDs.slice((i*100),(i*100+100)).join()
				}
			});
			for (j = 0; j < response.data.audio_features.length; j++) {
				tempoAndID.push({
					id: songIDs[j],
					tempo: response.data.audio_features[j].tempo,
					uri: response.data.audio_features[j].uri
				})
			}
		} catch (err) {
			console.log(err);
		};
	};
	return tempoAndID;

};

exports.getSongID = async (access, playlistID, url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`, songAcc = []) => {
	const songListOptions = options.trackList(access, playlistID);
	songListOptions.url = url;
	try {
		const response = await axios({
			method: "get",
			url: songListOptions.url,
			headers: songListOptions.headers,
			params: {
				fields: 'items(track(id)), next, limit'
			}
		})

		if (response.data.next == null) {
			for(i = 0; i < response.data.items.length; i++) {
				songAcc.push(response.data.items[i].track.id)
			};
			return songAcc;
		} else {
			for(i = 0; i < response.data.items.length; i++) {
				songAcc.push(response.data.items[i].track.id)
			};
			return exports.getSongID(access, playlistID, response.data.next, songAcc);
		}
		return response;
	} catch (err) {
		console.log(err)
	}
}

exports.createPlaylist = async (access, userID, selected, min, max) => {
	const createOptions = options.playlist(access, userID);
	createOptions.headers["Content-Type"] = "application/json"
	try {
		const response = await axios({
			method: "post",
			url: createOptions.url,
			headers: createOptions.headers,
			data: {
				name: `${selected} : ${min} - ${max} BPM`
			}
		})
		return {
			id: response.data.id,
			name: response.data.name
		}
	} catch (err) {
		console.log(err);
	}
}

exports.addSongs = async (access, playlistID, songList) => {
	const songURIs = []
	const addOptions = options.trackList(access, playlistID);
	addOptions.headers["Content-Type"] = "application/json"
	for (i = 0; i < songList.length; i++) {
		songURIs.push(songList[i].uri);
	};
	// try {
	// 	const response = await axios({
	// 		method: "post",
	// 		url: addOptions.url,
	// 		headers: addOptions.headers,
	// 		data: {
	// 			uris: songURIs
	// 		}
	// 	})
	// 	return response.status
	// } catch (err) {
	// 	console.log(err);
	// }

	const count = Math.ceil(songURIs.length / 100);
	const status = [];
	for (k = 0; k < count; k++) {
		try {
			const response = await axios ({
				method: "post",
				url: addOptions.url,
				headers: addOptions.headers,
				data: {
					uris: songURIs.slice((k*100),(k*100+100))
				}
			});
			status.push(response.status);
		} catch (err) {
			console.log(err);
		};
	};
	return status.every((v) => v == 201);
};
