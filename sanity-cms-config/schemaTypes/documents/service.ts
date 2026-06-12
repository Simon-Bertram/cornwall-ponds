import { defineField, defineType } from 'sanity'

export const service = defineType({
	name: 'service',
	title: 'Service',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
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
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'shortDescription',
			title: 'Short description',
			type: 'text',
			rows: 2,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [{ type: 'string' }],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: { title: 'title', slug: 'slug.current', media: 'image.image' },
		prepare: ({ title, slug, media }) => ({
			title: title ?? 'Service',
			subtitle: slug,
			media,
		}),
	},
})
