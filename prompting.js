const inquirer = require("inquirer");
const ctrl = require("./controller.js");
const data = require("./dataHandler.js");

const bpm = [
	{
		type: 'input',
		name: 'bpmMin',
		message: 'What is the minimum BPM for the new playlist?',
		validate: (value) => { //doesnt work as expected the validation
			const valid = !isNaN(parseFloat(value));
			return valid || 'Please enter a number'
		},
		filter: Number
	},
	{
		type: 'input',
		name: 'bpmMax',
		message: 'What is the maximum BPM for the new playlist?',
		validate: (value) => {
			const valid = !isNaN(parseFloat(value));
			return valid || 'Please enter a number'
		},
		filter: Number
	}
]

exports.selectTempo = async () => {
		return await inquirer.prompt(bpm, (input) => {
			return input;
		})
}

exports.selectPlaylist = async (playlistNames) => {
	return await inquirer.prompt([
		{
			type: 'rawlist',
			name: 'selection',
			message: 'Select or move to next?',
			choices: [...playlistNames, 'next']
		}
	],
	(input) => {
		return input;
	})
}

// exports.nextPlaylist = async (schema, nextPage, totalPlaylists, playlistRes, access_token, userID, playlists) => {
// 	prompt.get(schema, async (err, result) => {
// 		if (result.command === "next") {
// 			try {
// 				//get next page of playlists
// 				//prompt user again
// 				playlistRes = await ctrl.logPlaylists(access_token, userID, nextPage);
// 				playlists = data.store(playlistRes.data.items);
// 				nextPage = playlistRes.data.next;
// 				data.print(playlists);
// 				exports.nextPlaylist(schema, nextPage, totalPlaylists, playlistRes, access_token, userID, playlists);
// 			} catch (err) {
// 				console.log(err);
// 			}
// 		} else if (result.command === "stop") {//if (typeof(result.command) === "number") {
// 			//return a number !! reminder to set validators for the schema;
// 			console.log("Playlist Found!");
// 			prompt.get(['Selection'], )
// 		}
// 	})
// }
//
// exports.selectPlaylist = async (obj, schema) => {
// 	prompt.addProperties(obj, ['Selection'], function (err) {});
// };
