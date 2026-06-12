import { defineField, defineType } from 'sanity'

export const ourWorkPage = defineType({
	name: 'ourWorkPage',
	title: 'Our work page',
	type: 'document',
	fields: [
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Page title (H1)',
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
	preview: {
		prepare: () => ({ title: 'Our work page' }),
	},
})
