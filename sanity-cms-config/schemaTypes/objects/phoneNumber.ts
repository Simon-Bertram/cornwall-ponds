import { defineField, defineType } from 'sanity'

export const phoneNumber = defineType({
	name: 'phoneNumber',
	title: 'Phone number',
	type: 'object',
	fields: [
		defineField({
			name: 'display',
			title: 'Display',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'href',
			title: 'Tel link',
			description: 'e.g. tel:+441234567890',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
