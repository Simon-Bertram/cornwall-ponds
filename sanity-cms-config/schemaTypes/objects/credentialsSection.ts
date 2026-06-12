import { defineField, defineType } from 'sanity'

export const credentialsSection = defineType({
	name: 'credentialsSection',
	title: 'Credentials section',
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
	],
})
