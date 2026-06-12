import { defineField, defineType } from 'sanity'

export const heroSlide = defineType({
	name: 'heroSlide',
	title: 'Hero slide',
	type: 'document',
	fields: [
		defineField({
			name: 'image',
			title: 'Image',
			type: 'imageWithAlt',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitle',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'priority',
			title: 'Priority (LCP)',
			description: 'Mark the first slide for eager loading and high fetch priority.',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'order',
			title: 'Order',
			type: 'number',
			validation: (rule) => rule.required().integer().min(0),
		}),
	],
	orderings: [
		{
			title: 'Order',
			name: 'orderAsc',
			by: [{ field: 'order', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'subtitle',
			order: 'order',
			media: 'image.image',
		},
		prepare: ({ title, subtitle, order, media }) => ({
			title: title ?? 'Hero slide',
			subtitle: order != null ? `#${order} · ${subtitle ?? ''}` : subtitle,
			media,
		}),
	},
})
