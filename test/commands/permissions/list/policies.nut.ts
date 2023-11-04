import * as path from 'path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('when `permissions list policies` runs on an empty project', () => {
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
		const command = 'permissions list policies';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output.split('\n').length).to.be.equal(3);
	});

	it('should return empty results', () => {
		const command = 'permissions list policies --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).to.be.eql([]);
	});
});

describe('when `permissions list policies` runs on a nonempty project with a single package', () => {
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
		const command = 'permissions list policies';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const name = 'Empty';
		const filename = 'Empty User Access Policy';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output).to.contain(name);
		expect(output).to.contain(filename);
		expect(output.split('\n').length).to.be.greaterThan(3);
	});

	it('should not return empty results', () => {
		const command = 'permissions list policies --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).not.to.be.eql([]);
	});
});

describe('when `permissions list policies` runs on a nonempty project with multiple packages', () => {
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
		const command = 'permissions list policies';

		const columnHeader1 = 'Developer Name';
		const columnHeader2 = 'Label';

		const name1 = 'MainEmpty';
		const filename1 = 'Main Empty User Access Policy';

		const name2 = 'AnotherEmpty';
		const filename2 = 'Another Empty User Access Policy';

		const name3 = 'IgnoredEmpty';
		const filename3 = 'Ignored Empty User Access Policy';

		const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
		expect(output).to.contain(columnHeader1);
		expect(output).to.contain(columnHeader2);
		expect(output).to.contain(name1);
		expect(output).to.contain(filename1);
		expect(output).to.contain(name2);
		expect(output).to.contain(filename2);
		expect(output).not.to.contain(name3);
		expect(output).not.to.contain(filename3);
		expect(output.split('\n').length).to.be.greaterThan(3);
	});

	it('should not return empty results', () => {
		const command = 'permissions list policies --json';
		const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
		expect(output?.result).not.to.be.eql([]);
	});
});
