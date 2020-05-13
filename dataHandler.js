const data = [];


exports.store = (playlistArr) => {
	const playlistName = [];
	for(i = 0; i < playlistArr.length; i++) {
		data.push({
			name: playlistArr[i].name,
			id: playlistArr[i].id
		});
	};
	for(i = 0; i< playlistArr.length; i++) {
		playlistName.push(playlistArr[i].name)
	}
	return playlistName;
};

exports.getPlaylistID = (playlist) => {
	for(i = 0; i < data.length; i++) {
		if(data[i].name === playlist) {
			return data[i].id;
		}
	}
};
