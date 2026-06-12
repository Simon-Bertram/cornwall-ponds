import { defineField, defineType } from 'sanity'

const locationOptions = [
	{ title: 'Penzance', value: 'Penzance' },
	{ title: 'Bude', value: 'Bude' },
	{ title: 'Fowey', value: 'Fowey' },
	{ title: 'Truro', value: 'Truro' },
	{ title: 'Falmouth', value: 'Falmouth' },
	{ title: 'St Ives', value: 'St Ives' },
]

export const project = defineType({
	name: 'project',
	title: 'Project',
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
			name: 'service',
			title: 'Service',
			type: 'reference',
			to: [{ type: 'service' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
			options: { list: locationOptions },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'thumbnail',
			title: 'Thumbnail',
			type: 'imageWithAlt',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'beforeImage',
			title: 'Before image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'afterImage',
			title: 'After image',
			type: 'imageWithAlt',
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
			name: 'challenge',
			title: 'Challenge',
			type: 'array',
			of: [{ type: 'block' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'solution',
			title: 'Solution',
			type: 'array',
			of: [{ type: 'block' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'result',
			title: 'Result',
			type: 'array',
			of: [{ type: 'block' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'stats',
			title: 'Stats',
			type: 'projectStats',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [{ type: 'imageWithAlt' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'featured',
			title: 'Featured',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'title',
			location: 'location',
			media: 'thumbnail.image',
		},
		prepare: ({ title, location, media }) => ({
			title: title ?? 'Project',
			subtitle: location,
			media,
		}),
	},
})
