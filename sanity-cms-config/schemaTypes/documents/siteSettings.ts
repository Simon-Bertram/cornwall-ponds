import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({
			name: 'siteName',
			title: 'Site name',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'phone',
			title: 'Phone',
			type: 'phoneNumber',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'email',
			title: 'Email',
			type: 'string',
			validation: (rule) => rule.required().email(),
		}),
		defineField({
			name: 'address',
			title: 'Address',
			type: 'object',
			fields: [
				defineField({
					name: 'lines',
					title: 'Lines',
					type: 'array',
					of: [{ type: 'string' }],
					validation: (rule) => rule.required().min(1),
				}),
			],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'openingHours',
			title: 'Opening hours',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'serviceArea',
			title: 'Service area',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'yearsOfExperience',
			title: 'Years of experience',
			type: 'number',
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'trustBadge',
			title: 'Trust badge',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'footerBlurb',
			title: 'Footer blurb',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'footerQuickLinks',
			title: 'Footer quick links',
			type: 'array',
			of: [{ type: 'navLink' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'legalLinks',
			title: 'Legal links',
			type: 'array',
			of: [{ type: 'navLink' }],
			validation: (rule) => rule.required().min(1),
		}),
		defineField({
			name: 'copyrightNotice',
			title: 'Copyright notice',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'globalCta',
			title: 'Global CTA',
			type: 'globalCta',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		prepare: () => ({ title: 'Site settings' }),
	},
})
