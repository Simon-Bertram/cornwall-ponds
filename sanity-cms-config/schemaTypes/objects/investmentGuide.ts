import { defineField, defineType } from 'sanity'

export const investmentGuide = defineType({
	name: 'investmentGuide',
	title: 'Investment guide',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'intro',
			title: 'Intro',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'disclaimer',
			title: 'Disclaimer',
			type: 'text',
			rows: 2,
			validation: (rule) => rule.required(),
		}),
	],
})
