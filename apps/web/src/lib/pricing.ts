/**
 * Investment guide prices, keyed by service slug so each row resolves its
 * display name from the service entity (mirrors the planned Sanity
 * `servicesPage.pricingRows` reference design).
 */
export interface GuidePrice {
  serviceSlug: string;
  price: string;
}

export const guidePrices: GuidePrice[] = [
  { serviceSlug: "garden-ponds", price: "From £3,500" },
  { serviceSlug: "natural-swimming-ponds", price: "From £18,000" },
  { serviceSlug: "koi-ponds", price: "From £6,000" },
  { serviceSlug: "water-features", price: "From £1,200" },
  { serviceSlug: "maintenance", price: "From £180/visit" },
];
