import { defineField, defineType } from 'sanity'

/** Short title + intro pair used on page heroes. */
export const sectionIntro = defineType({
	name: 'sectionIntro',
	title: 'Section intro',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'intro',
			title: 'Intro',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
	],
})
