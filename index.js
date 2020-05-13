const axios = require("axios"); //http functions
const express = require("express");
const querystring = require("querystring");
const open = require("open"); //allows us to open browser window automatically
const inquirer = require("inquirer");
const fs = require("fs");
const ctrl = require("./controller.js");
const p = require("./prompting.js");
const data = require("./dataHandler.js");
const app = express();
//
const client_id = "f966e822e8624e3199d760c33b09fea2";
const client_secret = "56307ffa16554146b70ea667317a9014";
const redirect_uri = "http://localhost:8888/callback";
const scope = "playlist-read-private playlist-modify-private playlist-modify-public";

const authEndpoint =
	"https://accounts.spotify.com/authorize?" +
	querystring.stringify({
		response_type: "code",
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
  	});

const init = async () => {
	try {
		await open(authEndpoint)//, {app: ['chrome', '--incognito']}); //required if testing on own com
	} catch (err) {
		console.log(err);
	}
};

app.use(express.static('.'));

app.get("/callback", async (req, res) => {
	try {
		//get access token
		const [access_token, refresh_token] = await ctrl.getAccessToken(req.query.code, redirect_uri, client_id, client_secret);
		console.log("TOKENS RECEIVED...");

		//get user ID
		const userID = await ctrl.getUserID(access_token);

		//get users playlists
		const selected = await ctrl.playlistSelector(access_token, userID);
		const playlistID = data.getPlaylistID(selected);


		//get BPM requested
		const tempo = await p.selectTempo(); //tempo.bpmMax  and tempo.bpmMin represent the values

		//get songIDs from the playlists
		let songList = await ctrl.getSongList(access_token, playlistID);

		//get tempo from spotify
		songList = await ctrl.getTempo(access_token, songList); //returns object with tempo and ID

		//return song list that qualifies the data
		songList = data.filterTempo(songList, tempo.bpmMin, tempo.bpmMax)

		//create new playlist
		const newPlaylist = await ctrl.createPlaylist(access_token, userID, selected, tempo.bpmMin, tempo.bpmMax) //returns new playlistID

		//post songs
		const result = await ctrl.addSongs(access_token, newPlaylist.id, songList)
		if (result == 201) {
			console.log(`Your new playlist, ${newPlaylist.name}, has been created!`)
		}
	} catch (err) {
		console.log(err);
	}
	res.redirect("/index.html");
	res.end();
});

console.log("Listening on 8888");
app.listen(8888);
const obj = init();
