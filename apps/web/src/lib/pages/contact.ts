/**
 * Contact page copy and form options. Maps 1:1 to the planned Sanity
 * `contactPage` singleton.
 */
import type { SeoContent } from "./home";

export interface SelectOption {
  value: string;
  label: string;
}

export interface ContactPageContent {
  seo: SeoContent;
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    intro: string;
  };
  budgetOptions: SelectOption[];
}

export const contactPageContent: ContactPageContent = {
  seo: {
    title: "Request a Quote | Cornwall Ponds",
    description:
      "Contact our expert team to discuss your bespoke pond design, natural swimming pool, or water feature project in Cornwall and Devon.",
  },
  hero: {
    badge: "Start Your Project",
    title: "Let's Build Something",
    titleHighlight: "Extraordinary",
    intro:
      "Ready to transform your outdoor space? Fill out the form below to request a comprehensive consultation. Our design team will review your requirements and be in touch within 48 hours.",
  },
  budgetOptions: [
    { value: "Under £5k", label: "Under £5,000" },
    { value: "£5k - £15k", label: "£5,000 - £15,000" },
    { value: "£15k - £30k", label: "£15,000 - £30,000" },
    { value: "£30k+", label: "£30,000+" },
  ],
};
