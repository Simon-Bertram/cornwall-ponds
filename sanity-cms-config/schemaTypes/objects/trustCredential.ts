import { defineField, defineType } from 'sanity'

export const trustCredential = defineType({
	name: 'trustCredential',
	title: 'Trust credential',
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
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'svgPath',
			title: 'SVG path',
			description: 'Heroicon-style 24×24 stroke path data.',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
