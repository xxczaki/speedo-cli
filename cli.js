#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const meow = require('meow');
const speedTest = require('speedtest-net');
const Table = require('cli-table3');
const ora = require('ora');

const spinner = ora();

// Help message
meow(`
Usage:
  Just run ${chalk.green.bold('speedo')} to start a speed test!

 Powered by ${chalk.cyan('speedtest.net')}
`);

// Speed test configuration
const st = speedTest({maxTime: 5250});

// Output in MB/s
st.on('data', async data => {
	const download = await (data.speeds.download * 0.125).toFixed(2);
	const upload = await (data.speeds.upload * 0.125).toFixed(2);

	// Table
	const table = new Table({
		head: [`${chalk.red.bold('Type:')}`, `${chalk.red.bold('Speed:')}`],
		colWidths: [25, 25]
	});

	table.push(
		[`${chalk.cyan('Download')}`, `${chalk.green(`${download}`)} MB/s`],
		[`${chalk.cyan('Upload')}`, `${chalk.green(`${upload}`)} MB/s`],
		[`${chalk.cyan('Latency')}`, `${chalk.green(`${data.server.ping}`)} ms`]
	);

	// Print the final report table
	spinner.succeed('Done! Here is your speed report:\n');
	console.log(table.toString());
});

// Download and Upload speed log
st.on('downloadspeedprogress', async speed => {
	spinner.text = `Testing download speed... ${chalk.green(`${(await speed * 0.125).toFixed(2)} MB/s`)}`;
	spinner.start();
});
st.on('uploadspeedprogress', async speed => {
	spinner.text = `Testing upload speed... ${chalk.yellow(`${(await speed * 0.125).toFixed(2)} MB/s`)}`;
	spinner.start();
});

// Handle the error
st.on('error', err => {
	/* istanbul ignore next */
	if (err.code === 'ENOTFOUND') {
		console.error(chalk.red.bold('Unable to connect to the server :('));
	}
});
