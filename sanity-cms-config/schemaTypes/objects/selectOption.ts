import { defineField, defineType } from 'sanity'

export const selectOption = defineType({
	name: 'selectOption',
	title: 'Select option',
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
