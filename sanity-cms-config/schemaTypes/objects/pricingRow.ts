import { defineField, defineType } from 'sanity'

export const pricingRow = defineType({
	name: 'pricingRow',
	title: 'Pricing row',
	type: 'object',
	fields: [
		defineField({
			name: 'service',
			title: 'Service',
			type: 'reference',
			to: [{ type: 'service' }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'price',
			title: 'Price',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
})
