import { TestContext } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import PermissionsSumSets from '../../../../src/commands/permissions/sum/sets';

describe('permissions sum sets', () => {
	const $$ = new TestContext();
	let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

	beforeEach(() => {
		sfCommandStubs = stubSfCommandUx($$.SANDBOX);
	});

	afterEach(() => {
		$$.restore();
	});

	it('runs hello', async () => {
		await PermissionsSumSets.run([]);
		const output = sfCommandStubs.log
			.getCalls()
			.flatMap((c) => c.args)
			.join('\n');
		expect(output).to.include('hello world');
	});

	it('runs hello with --json and no provided name', async () => {
		const result = await PermissionsSumSets.run([]);
		expect(result.path).to.equal(
			'/Users/andres/Projects/proj-peral/plugin-permissions/src/commands/permissions/sum/sets.ts'
		);
	});

	it('runs hello world --name Astro', async () => {
		await PermissionsSumSets.run(['--name', 'Astro']);
		const output = sfCommandStubs.log
			.getCalls()
			.flatMap((c) => c.args)
			.join('\n');
		expect(output).to.include('hello Astro');
	});
});
