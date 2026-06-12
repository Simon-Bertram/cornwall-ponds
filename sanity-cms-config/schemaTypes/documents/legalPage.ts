import { defineField, defineType } from 'sanity'

export const legalPage = defineType({
	name: 'legalPage',
	title: 'Legal page',
	type: 'document',
	fields: [
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [{ type: 'block' }],
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { title: 'title', slug: 'slug.current' },
		prepare: ({ title, slug }) => ({
			title: title ?? 'Legal page',
			subtitle: slug ? `/${slug}` : undefined,
		}),
	},
})
