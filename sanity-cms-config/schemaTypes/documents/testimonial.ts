import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
	name: 'testimonial',
	title: 'Testimonial',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Location',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'quote',
			title: 'Quote',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'project',
			title: 'Project',
			type: 'reference',
			to: [{ type: 'project' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'rating',
			title: 'Rating',
			type: 'number',
			validation: (rule) => rule.required().min(1).max(5).integer(),
		}),
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'location',
			projectTitle: 'project.title',
		},
		prepare: ({ title, subtitle, projectTitle }) => ({
			title: title ?? 'Testimonial',
			subtitle: projectTitle ? `${subtitle} · ${projectTitle}` : subtitle,
		}),
	},
})
