import { defineField, defineType } from 'sanity'

export const seo = defineType({
	name: 'seo',
	title: 'SEO',
	type: 'object',
	fields: [
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
