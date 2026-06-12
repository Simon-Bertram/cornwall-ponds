import { defineField, defineType } from 'sanity'

export const globalCta = defineType({
	name: 'globalCta',
	title: 'Global CTA block',
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
			name: 'ctas',
			title: 'Buttons',
			type: 'array',
			of: [{ type: 'globalCtaButton' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'trustItems',
			title: 'Trust items',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.required().min(1),
		}),
	],
})
