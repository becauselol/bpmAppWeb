const express = require("express");
const base = require("./../controllers/base")
const playlist = require("./../controllers/playlists")
//insert controller

exports.landing =  async (req, res) => {
    res.render("landing");
};

exports.playlists = async (req, res) => {
    try {
        //get access token
        const [accessToken, refreshToken] = base.getToken(req.query.code);
        //get user ID
        const user = base.getUserID(accessToken);
        //get users playlists
        const playlistArr = playlist.getData(accessToken, user)
        res.render("playlists", {user: user, playlists: playlists})
    } catch (err) {
        console.log(err)
    }
    res.end();
}

exports.options = async (req, res) => {
    try {
        //get song

        //get audio features

        //add audio features and song names to template

        //render template
        res.render("songs", {songs: songs, features: features})
    } catch (err) {
        console.log(err)
    };
    res.end();
};

exports.creation = async (req, res) => {
    try {
        //receive input from options

        //filter songs according to optiosn

        //create playlist for user

        //add songs to playlists

        //render loading page
        res.render ("loading");
    } catch(err) {
        console.log(err);
    };
    res.end();
};

exports.success = (req, res) => {
    res.render("success");
}

exports.failure = (req, res) => {
    res.render("failure");
};
