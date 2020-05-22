//external modules
const axios = require("axios"); //http functions
const express = require("express");
const path = require("path");
const pug = require("pug");
const querystring = require("querystring");
const open = require("open"); //allows us to open browser window automatically
const inquirer = require("inquirer");

//my own stuff
const ctrl = require("./controls/controller.js");
const p = require("./controls/prompting.js");
const data = require("./controls/dataHandler.js");

const app = express();
require("dotenv").config();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
//
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri ="http://localhost:8888/callback"; // process.env.REDIRECT_URI || 
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


app.get("/playlist", async (req, res) => {
	try {
		//get access token
		const [access_token, refresh_token] = await ctrl.getAccessToken(req.query.code, redirect_uri, client_id, client_secret);
		console.log("TOKENS RECEIVED...");

		//get user ID
		const userID = await ctrl.getUserID(access_token);

		//get users playlists
		const selected = await ctrl.playlistSelector(access_token, userID);
		const playlistID = data.getPlaylistID(selected);

    } catch (err) {
        console.log(err)
    }
	res.end();
});

console.log("Listening on 8888");
app.listen(8888);
