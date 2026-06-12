import { defineField, defineType } from 'sanity'

export const expertisePage = defineType({
	name: 'expertisePage',
	title: 'Expertise page',
	type: 'document',
	fields: [
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'header',
			title: 'Header',
			type: 'sectionIntro',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'whyChooseUs',
			title: 'Why choose us',
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
					name: 'pillars',
					title: 'Pillars',
					type: 'array',
					of: [{ type: 'trustPillar' }],
					validation: (r) => r.required().min(1),
				}),
				defineField({
					name: 'stats',
					title: 'Stats',
					type: 'array',
					of: [{ type: 'trustStat' }],
					validation: (r) => r.required().min(1),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'credentialsSection',
			title: 'Credentials section',
			type: 'credentialsSection',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'testimonialsTitle',
			title: 'Testimonials title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		prepare: () => ({ title: 'Expertise page' }),
	},
})
