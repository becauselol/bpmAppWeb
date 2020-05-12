const data = [];

exports.store = (playlistArr) => {
	for(i = 0; i < playlistArr.length; i++) {
		data.push({
			name: playlistArr[i].name,
			id: playlistArr[i].id
		});
	};
	return data;
};

exports.print = (playlists) => {
	for(i = 0; i < data.length; i++) {
		console.log(`${i}	${data[i].name}`)
	};
}
