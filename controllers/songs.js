const axios = require("axios");
const endpoint = require("./endpoints");

exports.getTracks = async (access, playlistID, url = endpoint.url(playlistID, "tracks"), songAcc = [[],[]]) => {
	const addToArray = (arr, res) => {
		for(i = 0; i< res.data.items.length; i++) {
			arr.push({
				id: res.data.items[i].track.id,
				name: res.data.items[i].track.name,
				artists: res.data.items[i].track.artists,
				image: res.data.items[i].track.album.images[1].url, //link for a 300x300 image
				album: res.data.items[i].track.album.name
			})
		};
	};
	const addIDs = (arr, res) => {
		for(i=0; i< res.data.items.length; i++) {
			arr.push(res.data.items[i].track.id)
		};
	};
	const songOptions = endpoint.tracks(access, playlistID);
	songOptions.url = url;
	try {
		const result = await axios({
			method: "get",
			url: songOptions.url,
			headers: songOptions.headers,
			params: {
				fields: 'items(track(id, name, artists, album(images, name))), next',
				limit: 100
			}
		})
		if (result.data.next == null) {
			addToArray(songAcc[0], result)
			addIDs(songAcc[1], result)
			return songAcc;
		} else {
			addToArray(songAcc[0], result).
			addIDs(songAcc[1], result)
			return exports.getTracks(access, playlistID, result.data.next, songAcc);
		}
	} catch (err) {
		console.log(err);
	};
};

exports.getFeatures = async (access, songIDs, tracks) => {
	const featureOptions = endpoint.audioFeatures(access)
	const count = Math.ceil(tracks.length / 100);
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
				tracks[j] = {...tracks[j], ...response.data.audio_features[j]}
			}
		} catch (err) {
			console.log(err);
		};
	};
	return tracks;
};

exports.add = async (access, playlistID, songList) => {
	const songURIs = []
	const addOptions = options.trackList(access, playlistID);
	addOptions.headers["Content-Type"] = "application/json"
	for (i = 0; i < songList.length; i++) {
		songURIs.push(songList[i].uri);
	};

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
