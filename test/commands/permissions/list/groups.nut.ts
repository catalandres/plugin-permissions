import * as path from 'node:path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('when `permissions list groups` runs on an empty project', () => {
	let session: TestSession;

	before(async () => {
		session = await TestSession.create({
			project: {
				sourceDir: path.join(process.cwd(), 'test', 'scenarios', 'project-empty'),
			},
			devhubAuthStrategy: 'AUTO',
		});
	});

	after(async () => {
		await session?.clean();
	});

	it('should display table properly', () => {
		const command = 'permissions list groups';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output.split('\n').length).to.be.equal(3);
	});

	it('should return empty results', () => {
		const command = 'permissions list groups --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).to.be.eql([]);
	});
});

describe('when `permissions list groups` runs on a nonempty project with a single package', () => {
	let session: TestSession;

	before(async () => {
		session = await TestSession.create({
			project: {
				sourceDir: path.join(process.cwd(), 'test', 'scenarios', 'project-monopackage'),
			},
			devhubAuthStrategy: 'AUTO',
		});
	});

	after(async () => {
		await session?.clean();
	});

	it('should display table properly', () => {
		const command = 'permissions list groups';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const name = 'Empty';
		const fileName = 'Empty Permission Set Group';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output).to.contain(name);
		expect(output).to.contain(fileName);
		expect(output.split('\n').length).to.be.greaterThan(3);
	});

	it('should not return empty results', () => {
		const command = 'permissions list groups --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).not.to.be.eql([]);
	});
});

describe('when `permissions list groups` runs on a nonempty project with multiple packages', () => {
	let session: TestSession;

	before(async () => {
		session = await TestSession.create({
			project: {
				sourceDir: path.join(process.cwd(), 'test', 'scenarios', 'project-multipackage'),
			},
			devhubAuthStrategy: 'AUTO',
		});
	});

	after(async () => {
		await session?.clean();
	});

	it('should display table properly', () => {
		const command = 'permissions list groups';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const name1 = 'MainEmpty';
		const fileName1 = 'Main Empty Permission Set Group';

		const name2 = 'AnotherEmpty';
		const fileName2 = 'Another Empty Permission Set Group';

		const name3 = 'IgnoredEmpty';
		const fileName3 = 'Ignored Empty Permission Set Group';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output).to.contain(name1);
		expect(output).to.contain(fileName1);
		expect(output).to.contain(name2);
		expect(output).to.contain(fileName2);
		expect(output).not.to.contain(name3);
		expect(output).not.to.contain(fileName3);
		expect(output.split('\n').length).to.be.greaterThan(3);
	});

	it('should not return empty results', () => {
		const command = 'permissions list groups --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).not.to.be.eql([]);
	});
});
