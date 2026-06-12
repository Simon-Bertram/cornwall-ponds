import { defineField, defineType } from 'sanity'

export const globalCtaButton = defineType({
	name: 'globalCtaButton',
	title: 'Global CTA button',
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
		defineField({
			name: 'variant',
			title: 'Variant',
			type: 'string',
			options: {
				list: [
					{ title: 'Hero primary', value: 'hero-primary' },
					{ title: 'Hero outline', value: 'hero-outline' },
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
	],
})
