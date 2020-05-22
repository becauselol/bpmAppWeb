const endpoints = require("endpoints")

exports.getData = async (access, userID, url = endpoints.url.playlists , playlistAcc = []) => {
    const addToArray = (arr, response) => {
        for (i = 0; i < response.data.items.length; i++) {
            arr.push({
                response.data.items[iter].id,
                response.data.items[iter].name
            });
        };
    };
	const playlistOptions = options.playlist(access, userID);
	playlistOptions.url = url;
    try {
        const result = await axios({
    		method: "get",
    		url: playlistOptions.url,
    		headers: playlistOptions.headers,
            params: {
                limit: 50
            }
    	})
        if (result.data.next == null) {
            addToArray(playlistAcc, result);
            return playlistAcc;
        } else {
            addToArray(playlistAcc, result);
            return exports.getPlaylistData(access, userID, result.data.next, playlistAcc);
        }
    } catch(err) {
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
