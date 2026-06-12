import { defineField, defineType } from 'sanity'

export const trustStat = defineType({
	name: 'trustStat',
	title: 'Trust stat',
	type: 'object',
	fields: [
		defineField({
			name: 'value',
			title: 'Value',
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
