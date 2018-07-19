import test from 'ava';
import execa from 'execa';

test('Test general output', async t => {
	const {stdout} = await execa.shell('node ./cli.js');
	t.true(stdout.length > 0);
});

test('Test --help output', async t => {
	const {stdout} = await execa.shell('node ./cli.js --help');
	t.true(stdout.length > 0);
});
