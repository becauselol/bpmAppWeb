const prompt = require("prompt");
const ctrl = require("./controller.js");
const data = require("./dataHandler.js");

exports.nextPlaylist = async (schema, nextPage, totalPlaylists, playlistRes, access_token, userID, playlists) => {
	prompt.get(schema, async (err, result) => {
		if (result.command === "next") {
			try {
				//get next page of playlists
				//prompt user again
				playlistRes = await ctrl.logPlaylists(access_token, userID, nextPage);
				playlists = data.store(playlistRes.data.items);
				nextPage = playlistRes.data.next;
				data.print(playlists);
				exports.nextPlaylist(schema, nextPage, totalPlaylists, playlistRes, access_token, userID, playlists);
			} catch (err) {
				console.log(err);
			}
		} else {//if (typeof(result.command) === "number") {
			//return a number !! reminder to set validators for the schema;
			return result.command;
		}
	})
}
