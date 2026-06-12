import { defineField, defineType } from 'sanity'

export const imageWithAlt = defineType({
	name: 'imageWithAlt',
	title: 'Image with alt text',
	type: 'object',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'alt',
			title: 'Alt text',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
