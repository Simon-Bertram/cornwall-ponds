import { defineField, defineType } from 'sanity'

export const homePage = defineType({
	name: 'homePage',
	title: 'Home page',
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
					name: 'regionLabel',
					title: 'Region label',
					description: 'Accessible label for the hero slideshow region.',
					type: 'string',
					validation: (rule) => rule.required(),
				}),
				defineField({
					name: 'slides',
					title: 'Slides',
					type: 'array',
					of: [{ type: 'reference', to: [{ type: 'heroSlide' }] }],
					validation: (rule) => rule.required().min(1),
				}),
				defineField({
					name: 'ctas',
					title: 'CTAs',
					type: 'array',
					of: [{ type: 'cta' }],
					validation: (rule) => rule.required().min(1),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'servicesPreview',
			title: 'Services preview',
			type: 'object',
			fields: [
				defineField({ name: 'eyebrow', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({
					name: 'description',
					type: 'text',
					rows: 3,
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'footerCta',
					title: 'Footer CTA',
					type: 'footerCta',
					validation: (r) => r.required(),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'transformations',
			title: 'Transformations',
			type: 'object',
			fields: [
				defineField({ name: 'eyebrow', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({
					name: 'description',
					type: 'text',
					rows: 3,
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'ctaLabel',
					title: 'CTA label',
					type: 'string',
					validation: (r) => r.required(),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'howWeWork',
			title: 'How we work',
			type: 'object',
			fields: [
				defineField({ name: 'eyebrow', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
				defineField({
					name: 'description',
					type: 'text',
					rows: 3,
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'stepsAriaLabel',
					title: 'Steps aria label',
					type: 'string',
					validation: (r) => r.required(),
				}),
				defineField({
					name: 'steps',
					title: 'Steps',
					type: 'array',
					of: [{ type: 'processStep' }],
					validation: (r) => r.required().min(1),
				}),
				defineField({
					name: 'footerCta',
					title: 'Footer CTA',
					type: 'footerCta',
					validation: (r) => r.required(),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'testimonials',
			title: 'Testimonials section',
			type: 'object',
			fields: [
				defineField({ name: 'eyebrow', type: 'string', validation: (r) => r.required() }),
				defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
			],
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		prepare: () => ({ title: 'Home page' }),
	},
})
