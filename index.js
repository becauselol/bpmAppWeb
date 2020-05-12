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

app.get("/callback", (req, res) => {
	const code = req.query.code;
	const authOptions = {
	    url: "https://accounts.spotify.com/api/token",
	    form: {
		    code: code,
		    redirect_uri: redirect_uri,
		    grant_type: "authorization_code",
	    },
	    headers: {
		    "content-type": "application/x-www-form-urlencoded",
			Authorization:
		        "Basic " +
		        Buffer.from(`${client_id}:${client_secret}`).toString("base64"), // client id and secret from env
    	},
	};
	console.log("REQUESTING TOKENS...");

	//test to request for profile info
	axios({
		method: "post",
		url: authOptions.url,
		data: querystring.stringify(authOptions.form),
		headers: authOptions.headers,
	})
	.then((res) => {
		const access_token = res.data.access_token;
		const refresh_token = res.data.refresh_token;
	})
	.catch((err) => {
		console.log(err);
	});
});



console.log("Listening on 8888");
app.listen(8888);

authorizationInit();
