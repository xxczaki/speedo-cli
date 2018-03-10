#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const speedTest = require('speedtest-net');
const figures = require('figures');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

const arg = process.argv[2];

updateNotifier({pkg}).notify();

// Help message
if (arg === '-h' || arg === '--help') { // Display help message
  console.log(`
Usage:
 Just run ${chalk.green.bold('speedo')} to start a speed test!

 `);
  process.exit(1);
}

// Speed test config
const st = speedTest({maxTime: 5000});

st.on('data', data => {
	const download = (data.speeds.download * 125).toFixed(2);
	const upload = (data.speeds.upload * 125).toFixed(2);
	const ping = data.server.ping;

	let msg = chalk.green.bold('\nFinal Report:\n');
	msg += chalk.cyan(`${figures.pointerSmall} Download speed: ${chalk.green(`${download}`)} kB/s\n`);
	msg += chalk.cyan(`${figures.pointerSmall} Upload speed: ${chalk.green(`${upload}`)} kB/s\n`);
	msg += chalk.cyan(`${figures.pointerSmall} Latency: ${chalk.green(`${ping}`)} ms`);

  console.log(msg);
});

console.log(chalk.magenta.bold(`${figures.info} Speed test in progress...`));
st.on('downloadspeedprogress', speed => {
	const msg = chalk.green(`${figures.arrowDown} Download: ${(speed * 125).toFixed(2)} kB/s`);
  console.log(msg);
});
st.on('uploadspeedprogress', speed => {
	const msg = chalk.yellow(`${figures.arrowUp} Upload: ${(speed * 125).toFixed(2)} kB/s`);
  console.log(msg);
});

st.on('error', err => {
	if (err.code === 'ENOTFOUND') {
console.error(chalk.red.bold(`${figures.cross} Unable to connect to the server. Please check your internet connection and try again!`));
	}
});