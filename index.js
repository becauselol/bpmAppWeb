const axios = require("axios"); //http functions
const express = require("express");
const querystring = require("querystring");
const open = require("open"); //allows us to open browser window automatically
const prompt = require("prompt");
const fs = require("fs");
const ctrl = require("./controller.js");
const p = require("./prompting.js");
const data = require("./dataHandler.js");
const app = express();
prompt.start();
//
const client_id = "f966e822e8624e3199d760c33b09fea2";
const client_secret = "56307ffa16554146b70ea667317a9014";
const redirect_uri = "http://localhost:8888/callback";
const scope = "playlist-read-private playlist-modify-private";

const schema = {
	properties: {
		command: {
			message: 'Only valid numbers or next',
			required: true
		}
	}
};

const tempoSchema = {
	properties: {
		MaxTempo: {
			required: true
		},
		MinTempo: {
			required: true
		}
	}
};

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
		//get BPM requested
		prompt.get(tempoSchema, async (err, result) => {
			//get users playlists
			let playlistRes = await ctrl.logPlaylists(access_token, userID);
			const totalPlaylists = playlistRes.data.total;
			let nextPage = playlistRes.data.next;
			let playlists = data.store(playlistRes.data.items);
			data.print(playlists);
			//prompt user to choose a playlist or go to next
			p.nextPlaylist(schema, nextPage, totalPlaylists, playlistRes, access_token, userID, playlists);
			//once user chooses a playlist save songID to an array

			//get tempo for all songs, based on spotify "tempo"
			const tempoMax = result.MaxTempo
			const tempoMin = result.MinTempo
			//return song list that qualifies the data

			//create new playlist

			//post new playlist

		})
	} catch (err) {
		console.log(err);
	}
	res.redirect("/index.html");
	res.end();
});

console.log("Listening on 8888");
app.listen(8888);
const obj = init();
