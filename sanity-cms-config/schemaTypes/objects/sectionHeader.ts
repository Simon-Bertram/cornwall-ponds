import { defineField, defineType } from 'sanity'

export const sectionHeader = defineType({
	name: 'sectionHeader',
	title: 'Section header',
	type: 'object',
	fields: [
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
	],
})
