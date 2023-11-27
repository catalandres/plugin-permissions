import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
// import { getPermissionSets } from '../../../core/componentSearch';
// import { PermissionSet } from '../../../types/metadata';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('plugin-permissions', 'permissions.sum.sets');

export type PermissionsSumSetsResult = {
	path: string;
};

export default class PermissionsSumSets extends SfCommand<PermissionsSumSetsResult> {
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
		set: Flags.string({
			summary: messages.getMessage('flags.set.summary'),
			char: 's',
			required: true,
			multiple: true,
		}),
	};

	public async run(): Promise<PermissionsSumSetsResult> {
		const { flags } = await this.parse(PermissionsSumSets);

		const name = flags.name ?? 'world';
		this.log(
			`hello ${name} from /Users/andres/Projects/proj-peral/plugin-permissions/src/commands/permissions/sum/sets.ts`
		);
		// const permissionSetsByName: Map<string, PermissionSet> = getPermissionSets(flags.set);
		// console.log(permissionSetsByName);
		// permissionSetsByName.forEach((value: PermissionSet, key) => {
		// console.log(value);
		// console.log(value['xmlns']);

		// const psMap = new Map(Object.entries(value));
		// console.log(psMap);
		// console.log(psMap.get('xmlns'));
		// });

		// console.log(permissionSetsByName.keys());
		return {
			path: '/Users/andres/Projects/proj-peral/plugin-permissions/src/commands/permissions/sum/sets.ts',
		};
	}
}
