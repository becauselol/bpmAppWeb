const data = [];

exports.filterAttribute = (songList, min, max, attribute) => { //songlist is tempo and id
	const result = [];
	for(i = 0; i < songList.length ; i++) {
		if(songList[i][attribute] >= min && songList[i][attribute] <= max) {
			result.push(songList[i]);
		} else {
			continue
		}
	}
	return result
}
