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

exports.addSongs = async (access, playlistID, songList) => {
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
