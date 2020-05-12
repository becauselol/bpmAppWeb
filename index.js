const axios = require("axios"); //http functions
const express = require("express");
const querystring = require("querystring");
const open = require("open"); //allows us to open browser window automatically
const prompt = require("prompt");
const ctrl = require("./controller.js");
const fs = require("fs");
const data = require("./dataHandler.js");
const p = require("./promptRouting.js");
const app = express();
prompt.start();
//
const client_id = "f966e822e8624e3199d760c33b09fea2";
const client_secret = "56307ffa16554146b70ea667317a9014";
const redirect_uri = "http://localhost:8888/callback";
const scope = "playlist-read-private playlist-modify-private";

const authEndpoint =
	"https://accounts.spotify.com/authorize?" +
	querystring.stringify({
		response_type: "code",
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
  	});

const authorizationInit = async () => {
  	await open(authEndpoint)//, {app: ['chrome', '--incognito']}); //required if testing on own com
};

app.use(express.static('.'));

app.get("/callback", async (req, res) => {
	try {
		//get access token
		const [access_token, refresh_token] = await ctrl.getAccessToken(req.query.code, redirect_uri, client_id, client_secret);
		console.log("TOKENS RECEIVED...");
		//get user ID
		const userID = await ctrl.getUserID(access_token);
		//log users playlists
		const playlistRes = await ctrl.logPlaylists(access_token, userID);
		const totalPlaylists = playlistRes.total;
		const nextPage = playlistRes.next;
		const playlists = data.store(playlistRes.data.items);
		data.print(playlists);
		//prompt user to choose a playlist or go to next
		prompt.get()

		//once user chooses a playlist save songID to an array

		//get tempo for all songs, based on spotify "tempo"

		//return song list that qualifies the data

		//create new playlist

		//post new playlist

	} catch (err) {
		console.log(err);
	}
	res.redirect("/index.html");
	res.end();
});




console.log("Listening on 8888");
app.listen(8888);

authorizationInit();
