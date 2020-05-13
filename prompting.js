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
