import { defineField, defineType } from 'sanity'

export const projectStats = defineType({
	name: 'projectStats',
	title: 'Project stats',
	type: 'object',
	fields: [
		defineField({
			name: 'duration',
			title: 'Duration',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'volume',
			title: 'Volume',
			type: 'string',
		}),
		defineField({
			name: 'area',
			title: 'Area',
			type: 'string',
		}),
		defineField({
			name: 'depth',
			title: 'Depth',
			type: 'string',
		}),
	],
})
