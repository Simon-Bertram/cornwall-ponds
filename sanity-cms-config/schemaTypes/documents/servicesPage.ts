import { defineField, defineType } from 'sanity'

export const servicesPage = defineType({
	name: 'servicesPage',
	title: 'Services page',
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
			type: 'sectionIntro',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'philosophyPillars',
			title: 'Philosophy pillars',
			type: 'array',
			of: [{ type: 'philosophyPillar' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'pricingRows',
			title: 'Pricing rows',
			type: 'array',
			of: [{ type: 'pricingRow' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'investmentGuide',
			title: 'Investment guide',
			type: 'investmentGuide',
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
		prepare: () => ({ title: 'Services page' }),
	},
})
