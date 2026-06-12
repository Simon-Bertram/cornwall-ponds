import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
	name: 'contactPage',
	title: 'Contact page',
	type: 'document',
	fields: [
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'hero',
			title: 'Hero',
			type: 'object',
			fields: [
				defineField({
					name: 'badge',
					title: 'Badge',
					type: 'string',
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'title',
					title: 'Title',
					type: 'string',
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'titleHighlight',
					title: 'Title highlight',
					type: 'string',
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'intro',
					title: 'Intro',
					type: 'text',
					rows: 3,
					validation: (r) => r.required(),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'budgetOptions',
			title: 'Budget options',
			type: 'array',
			of: [{ type: 'selectOption' }],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		prepare: () => ({ title: 'Contact page' }),
	},
})
