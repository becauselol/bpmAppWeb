const express = require("express");
const base = require("./../controllers/base")
const playlist = require("./../controllers/playlists")
const song = require("./../controllers/songs")
const endpoint = require("./../controllers/endpoints")
const User = require("./../models/userModel")
const data = require("./../controllers/dataHandler")
//insert controller

exports.landing =  async (req, res) => {
    res.render("landing", {url: endpoint.auth.url});
};

exports.auth = async (req, res) => {
    try {
        //get access token
        const [accessToken, refreshToken] = await base.getToken(req.query.code);
        //get user ID
        const user = await base.getUserID(accessToken);
		const exist = await User.findOne({userID: user})
		if (exist == null) {
			const newUser = await User.create({
				userID: user,
				accessToken,
				refreshToken
			})
		}
        //get users playlists
		res.redirect(`/playlist/${user}`);
    } catch (err) {
        console.log(err)
    }
    res.end();
}

exports.playlist = async (req, res) => {
	try {
		const userInfo = await User.findOne({userID: req.params.user})
		const playlistArr = await playlist.getData(userInfo.accessToken, userInfo.userID)
		res.render("playlists", {user: userInfo.userID, playlistArr: playlistArr})
	} catch (err) {
		console.log(err);
	}
}

exports.options = async (req, res) => {
    try { //req.params.id is the id of the playlist
		const userInfo = await User.findOne({userID: req.params.user})
        //get song
		let [tracks, songIDs] = await song.getTracks(userInfo.accessToken, req.params.id)
		const playlistName = await playlist.getName(userInfo.accessToken, req.params.id)
        //get audio features
		tracks = await song.getFeatures(userInfo.accessToken, songIDs, tracks)
        res.render("songs", {tracks, playlistName, playlistID: req.params.id, songIDs})
    } catch (err) {
        console.log(err)
    };
    res.end();
};

exports.creation = async (req, res) => {
    try {
		const userInfo = await User.findOne({userID: req.params.user})
		let [tracks, songIDs] = await song.getTracks(userInfo.accessToken, req.params.id)
		tracks = await song.getFeatures(userInfo.accessToken, songIDs, tracks)
        //receive input from options
        //filter songs according to optiosn
		tracks = data.filterAttribute(tracks, req.query.min, req.query.max, "tempo");
        // create playlist for user
		const playlistName = await playlist.getName(userInfo.accessToken, req.params.id)
		const newPlaylist = await playlist.create(userInfo.accessToken, userInfo.userID, playlistName, req.query.min, req.query.max)
        //add songs to playlists
		const status = await song.add(userInfo.accessToken, newPlaylist.id, tracks)
		if (status) {
			res.redirect(`/success/?name=${newPlaylist.name}&user=${userInfo.userID}`)
		} else {
			res.redirect("/failure")
		}
        //render loading page
    } catch(err) {
        console.log(err);
    };
    res.end();
};

exports.success = (req, res) => {
    res.render("success", {playlistName: req.query.name, userID: req.query.user});
}

exports.failure = (req, res) => {
    res.render("failure");
};
