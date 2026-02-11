import { modernTemplate } from './modern';
import { classicTemplate } from './classic';
import { techTemplate } from './tech';
import { boldTemplate } from './bold';
import type { TemplateDefinition, TemplateId } from '../types';

export const templates: Record<TemplateId, TemplateDefinition> = {
	modern: modernTemplate,
	classic: classicTemplate,
	tech: techTemplate,
	bold: boldTemplate
};

export const defaultTemplate = modernTemplate;

export function getTemplate(id?: TemplateId): TemplateDefinition {
	if (!id || !templates[id]) return defaultTemplate;
	return templates[id];
}

export const templateOptions = Object.values(templates).map((t) => ({
	id: t.id,
	name: t.name,
	description: t.description
}));
