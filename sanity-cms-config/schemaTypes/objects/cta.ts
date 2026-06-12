import { defineField, defineType } from 'sanity'

export const cta = defineType({
	name: 'cta',
	title: 'Call to action',
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
			name: 'tone',
			title: 'Tone',
			type: 'string',
			options: {
				list: [
					{ title: 'Primary', value: 'primary' },
					{ title: 'Secondary', value: 'secondary' },
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
	],
})
