import { defineField, defineType } from 'sanity'

export const trustPillar = defineType({
	name: 'trustPillar',
	title: 'Trust pillar',
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
			name: 'icon',
			title: 'Icon',
			type: 'string',
			options: {
				list: [
					{ title: 'Trophy', value: 'trophy' },
					{ title: 'Leaf', value: 'leaf' },
					{ title: 'Shield', value: 'shield' },
					{ title: 'Heart', value: 'heart' },
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
	],
})
