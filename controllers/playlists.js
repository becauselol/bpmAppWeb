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
