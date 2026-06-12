import type { StructureResolver } from 'sanity/structure'

const singleton = (
	S: Parameters<StructureResolver>[0],
	schemaType: string,
	title: string,
	documentId?: string,
) =>
	S.listItem()
		.title(title)
		.id(documentId ?? schemaType)
		.child(
			S.document()
				.schemaType(schemaType)
				.documentId(documentId ?? schemaType)
				.title(title),
		)

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			singleton(S, 'siteSettings', 'Site settings'),

			S.divider(),

			S.listItem()
				.title('Pages')
				.child(
					S.list()
						.title('Pages')
						.items([
							singleton(S, 'homePage', 'Home'),
							singleton(S, 'servicesPage', 'Services'),
							singleton(S, 'expertisePage', 'Expertise'),
							singleton(S, 'contactPage', 'Contact'),
							singleton(S, 'ourWorkPage', 'Our work'),
							S.listItem()
								.title('Legal')
								.child(
									S.list()
										.title('Legal')
										.items([
											singleton(
												S,
												'legalPage',
												'Privacy policy',
												'legalPage-privacy',
											),
											singleton(
												S,
												'legalPage',
												'Terms of service',
												'legalPage-terms',
											),
										]),
								),
						]),
				),

			S.divider(),

			S.listItem()
				.title('Content')
				.child(
					S.list()
						.title('Content')
						.items([
							S.documentTypeListItem('service').title('Services'),
							S.documentTypeListItem('project').title('Projects'),
							S.documentTypeListItem('testimonial').title('Testimonials'),
							S.documentTypeListItem('heroSlide').title('Hero slides'),
						]),
				),
		])
