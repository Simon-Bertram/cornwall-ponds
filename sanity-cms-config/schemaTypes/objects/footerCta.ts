import { defineField, defineType } from 'sanity'

export const footerCta = defineType({
	name: 'footerCta',
	title: 'Footer CTA',
	type: 'object',
	fields: [
		defineField({
			name: 'copy',
			title: 'Supporting copy',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'href',
			title: 'URL',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'label',
			title: 'Button label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
