import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { SfProject, Messages } from '@salesforce/core';
import { MetadataComponent, makeData, searchComponent } from '../../../core/componentSearch';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('plugin-permissions', 'permissions.list.sets');

export default class PermissionsListSets extends SfCommand<MetadataComponent[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      description: messages.getMessage('flags.name.description'),
      char: 'n',
      required: false,
    }),
  };

  public async run(): Promise<MetadataComponent[]> {
    // We introduce flags later
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flags } = await this.parse(PermissionsListSets);

    const permissionSetFiles: MetadataComponent[] = searchComponent(SfProject.getInstance().getPath(), 'permissionset');

    this.table(
      permissionSetFiles.map((file) => makeData(file)),
      {
        name: {
          header: 'Developer Name',
        },
        label: {
          header: 'Label',
        },
      },
      {
        'no-header': false,
      }
    );

    return permissionSetFiles;
  }
}
