import * as fs from 'node:fs';
import * as xml2js from 'xml2js';
import { glob } from 'fast-glob';
import { SfProject, NamedPackageDir } from '@salesforce/core';
import { PermissionSet, PermissionSetGroup, UserAccessPolicy } from '../types/metadata';

export class MetadataComponent {
	public label = '';
	public name = '';
	public description = '';
	public fullPath = '';
	public projectPath = '';
	public packagePath = '';
	public path = '';
	public filename = '';
}

export enum MetadataComponentType {
	PERMISSION_SET = 'permissionset',
	PERMISSION_SET_GROUP = 'permissionsetgroup',
	USER_ACCESS_POLICY = 'useraccesspolicy',
}

interface PermissionSetParsingResult {
	PermissionSet: PermissionSet;
}

interface PermissionSetGroupParsingResult {
	PermissionSetGroup: PermissionSetGroup;
}

interface UserAccessPolicyParsingResult {
	UserAccessPolicy: UserAccessPolicy;
}

export function makeData(component: MetadataComponent): Record<string, unknown> {
	return JSON.parse(JSON.stringify(component)) as Record<string, unknown>;
}

export function searchComponentsByType(projectPath: string, componentType: MetadataComponentType): MetadataComponent[] {
	return searchComponentsByNameAndType(projectPath, '*', componentType);
}

export function searchComponentsByNameAndType(
	projectPath: string,
	componentName: string,
	componentType: MetadataComponentType
): MetadataComponent[] {
	const components: MetadataComponent[] = [];

	SfProject.getInstance(projectPath)
		.getUniquePackageDirectories()
		.forEach((thisPackage: NamedPackageDir) => {
			const searchPattern = thisPackage.fullPath + '/**/' + componentName + '.' + componentType + '-meta.xml';
			const files = glob.sync(searchPattern);
			files.forEach((fullPath) => {
				const component = new MetadataComponent();

				component.fullPath = fullPath;
				component.projectPath = projectPath;
				component.packagePath = thisPackage.path;

				const nameRegEx = new RegExp('.+/([^.]*)');
				component.name = nameRegEx.exec(component.fullPath)?.[1] as string;

				const filenameRegEx = new RegExp('.+/(.+)');
				component.filename = filenameRegEx.exec(component.fullPath)?.[1] as string;

				component.path = fullPath
					.replace(component.projectPath + '/', '')
					.replace(component.packagePath + '/', '')
					.replace('/' + component.filename, '');

				const xml = fs.readFileSync(fullPath, 'utf-8');

				switch (componentType) {
					case MetadataComponentType.PERMISSION_SET: {
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: PermissionSetParsingResult) => {
								component.label = result.PermissionSet.label;
								component.description = result.PermissionSet.description as string;
							}
						);
						break;
					}
					case MetadataComponentType.PERMISSION_SET_GROUP: {
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: PermissionSetGroupParsingResult) => {
								component.label = result.PermissionSetGroup.label;
								component.description = result.PermissionSetGroup.description as string;
							}
						);
						break;
					}
					case MetadataComponentType.USER_ACCESS_POLICY: {
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: UserAccessPolicyParsingResult) => {
								component.label = result.UserAccessPolicy.masterLabel;
								component.description = result.UserAccessPolicy.description as string;
							}
						);
						break;
					}
				}

				components.push(component);
			});
		});

	return components;
}

export function getPermissionSet(path: string): PermissionSet | undefined {
	let permissionSet: PermissionSet | undefined;
	const xml = fs.readFileSync(path, 'utf-8');
	xml2js.parseString(
		xml,
		{
			explicitArray: false,
			mergeAttrs: true,
			valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
		},
		(err, result: PermissionSetParsingResult) => {
			if (result) {
				permissionSet = result.PermissionSet;
			}
		}
	);
	return permissionSet;
}

export function getPermissionSets(names: string[]): Map<string, PermissionSet> {
	const permissionSets = new Map<string, PermissionSet>();

	names.forEach((name) => {
		const metadataComponents: MetadataComponent[] = searchComponentsByNameAndType(
			SfProject.getInstance().getPath(),
			name,
			MetadataComponentType.PERMISSION_SET
		);
		if (metadataComponents.length === 0) {
			// this.error(`Permission Set ${name} not found`);
		}
		if (metadataComponents.length === 1) {
			const permissionSet = getPermissionSet(metadataComponents[0].fullPath);
			if (permissionSet) {
				permissionSets.set(name, permissionSet);
			}
		}
		if (metadataComponents.length > 1) {
			// this.error(`Permission Set ${name} is ambiguous`);
		}
	});

	return permissionSets;
}
