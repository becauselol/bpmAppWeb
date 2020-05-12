const axios = require("axios"); //http functions
const express = require("express");
const querystring = require("querystring");
const open = require("open"); //allows us to open browser window automatically
const app = express();
const ctrl = require("./controller.js")
//
const client_id = "f966e822e8624e3199d760c33b09fea2";
const client_secret = "10638088097f4126887d2fce88538c3b";
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
  	await open(authEndpoint);
};

app.get("/callback", async (req, res) => {
	try {
		//get access token
		const [access_token, refresh_token] = await ctrl.getAccessToken(req.query.code, redirect_uri, client_id, client_secret);
		console.log(access_token);
		//get user ID
		const userID = await ctrl.getUserID(access_token);
		//log users playlists
		
		//prompt user to choose a playlist or go to next

		//once user chooses a playlist save songID to an array

		//get tempo for all songs, based on spotify "tempo"

		//return song list that qualifies the data

		//create new playlist

		//post new playlist
	} catch (err) {
		console.log(err);
	}
});



console.log("Listening on 8888");
app.listen(8888);

authorizationInit();
