import { SfCommand } from '@salesforce/sf-plugins-core'; // Flags
import { SfProject, Messages } from '@salesforce/core';
import {
	MetadataComponent,
	MetadataComponentType,
	makeData,
	searchComponentsByType,
} from '../../../core/componentSearch';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('plugin-permissions', 'permissions.list.sets');

export default class PermissionsListSets extends SfCommand<MetadataComponent[]> {
	public static readonly summary = messages.getMessage('summary');
	public static readonly description = messages.getMessage('description');
	public static readonly examples = messages.getMessages('examples');
	public static readonly aliases: string[] = [
		'permissions:list:permission-sets',
		// 'permissions:list:sets',
		'permissions:ls:sets',
		'permissions:ls:ps',
		'p:ls:ps',
	];
	// public static readonly flags = {
	//   name: Flags.string({
	//     summary: messages.getMessage('flags.name.summary'),
	//     description: messages.getMessage('flags.name.description'),
	//     char: 'n',
	//     required: false,
	//   }),
	// };

	public async run(): Promise<MetadataComponent[]> {
		// We introduce flags later
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { flags } = await this.parse(PermissionsListSets);

		const permissionSetFiles: MetadataComponent[] = searchComponentsByType(
			SfProject.getInstance().getPath(),
			MetadataComponentType.PERMISSION_SET
		);

		this.table(
			permissionSetFiles.map((file) => makeData(file)),
			{
				name: {
					header: 'Developer Name',
					minWidth: 20,
				},
				label: {
					header: 'Label',
					minWidth: 20,
				},
			},
			{
				'no-header': false,
			}
		);

		return permissionSetFiles;
	}
}
