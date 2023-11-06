import * as fs from 'fs';
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

export function searchComponent(projectPath: string, componentName: MetadataComponentType): MetadataComponent[] {
	const components: MetadataComponent[] = [];

	SfProject.getInstance(projectPath)
		.getUniquePackageDirectories()
		.forEach((thisPackage: NamedPackageDir) => {
			const searchPattern = thisPackage.fullPath + '/**/*.' + componentName + '-meta.xml';
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

				switch (componentName) {
					case MetadataComponentType.PERMISSION_SET: {
						let permissionSet: PermissionSet;
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: PermissionSetParsingResult) => {
								permissionSet = result.PermissionSet;
								component.label = permissionSet.label;
								component.description = permissionSet.description as string;
							}
						);
						break;
					}
					case MetadataComponentType.PERMISSION_SET_GROUP: {
						let permissionSetGroup: PermissionSetGroup;
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: PermissionSetGroupParsingResult) => {
								permissionSetGroup = result.PermissionSetGroup;
								component.label = permissionSetGroup.label;
								component.description = permissionSetGroup.description as string;
							}
						);
						break;
					}
					case MetadataComponentType.USER_ACCESS_POLICY: {
						let userAccessPolicy: UserAccessPolicy;
						xml2js.parseString(
							xml,
							{
								explicitArray: false,
								mergeAttrs: true,
								valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
							},
							(err, result: UserAccessPolicyParsingResult) => {
								userAccessPolicy = result.UserAccessPolicy;
								component.label = userAccessPolicy.masterLabel;
								component.description = userAccessPolicy.description as string;
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
