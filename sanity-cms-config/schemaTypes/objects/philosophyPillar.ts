import { defineField, defineType } from 'sanity'

export const philosophyPillar = defineType({
	name: 'philosophyPillar',
	title: 'Philosophy pillar',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'svgPaths',
			title: 'SVG paths',
			description: 'Heroicon-style 24×24 stroke path data (one or more paths).',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.required().min(1),
		}),
	],
})
