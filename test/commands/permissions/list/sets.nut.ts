import * as path from 'path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('when `permissions list sets` runs on an empty project', () => {
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
    const command = 'permissions list sets';

    const columnHeader1 = 'Developer Name';
    const columnHeader2 = 'Label';

    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.contain(columnHeader1);
    expect(output).to.contain(columnHeader2);
    expect(output.split('\n').length).to.be.equal(3);
  });

  it('should return empty results', () => {
    const command = 'permissions list sets --json';
    const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
    expect(output?.result).to.be.eql([]);
  });
});

describe('when `permissions list sets` runs on a nonempty project with a single package', () => {
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
    const command = 'permissions list sets';

    const columnHeader1 = 'Developer Name';
    const columnHeader2 = 'Label';

    const permissionSetName = 'Empty';
    const permissionSetFileName = 'Empty Permission Set';

    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.contain(columnHeader1);
    expect(output).to.contain(columnHeader2);
    expect(output).to.contain(permissionSetName);
    expect(output).to.contain(permissionSetFileName);
    expect(output.split('\n').length).to.be.greaterThan(3);
  });

  it('should not return empty results', () => {
    const command = 'permissions list sets --json';
    const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
    expect(output?.result).not.to.be.eql([]);
  });
});

describe('when `permissions list sets` runs on a nonempty project with multiple packages', () => {
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
    const command = 'permissions list sets';

    const columnHeader1 = 'Developer Name';
    const columnHeader2 = 'Label';

    const permissionSetName1 = 'MainEmpty';
    const permissionSetFileName1 = 'Main Empty Permission Set';

    const permissionSetName2 = 'AnotherEmpty';
    const permissionSetFileName2 = 'Another Empty Permission Set';

    const permissionSetName3 = 'IgnoredEmpty';
    const permissionSetFileName3 = 'Ignored Empty Permission Set';

    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.contain(columnHeader1);
    expect(output).to.contain(columnHeader2);
    expect(output).to.contain(permissionSetName1);
    expect(output).to.contain(permissionSetFileName1);
    expect(output).to.contain(permissionSetName2);
    expect(output).to.contain(permissionSetFileName2);
    expect(output).not.to.contain(permissionSetName3);
    expect(output).not.to.contain(permissionSetFileName3);
    expect(output.split('\n').length).to.be.greaterThan(3);
  });

  it('should not return empty results', () => {
    const command = 'permissions list sets --json';
    const output = execCmd(command, { ensureExitCode: 0 }).jsonOutput;
    expect(output?.result).not.to.be.eql([]);
  });
});
