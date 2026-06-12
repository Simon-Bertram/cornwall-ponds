import { defineField, defineType } from 'sanity'

export const navLink = defineType({
	name: 'navLink',
	title: 'Navigation link',
	type: 'object',
	fields: [
		defineField({
			name: 'href',
			title: 'URL',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'label',
			title: 'Label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
