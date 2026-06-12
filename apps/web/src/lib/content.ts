/**
 * Single content-access layer for the marketing site.
 *
 * All pages and components fetch data through these async accessors.
 * Today they return static modules; during the Sanity migration only
 * this file changes to GROQ fetches — call sites stay untouched.
 */
import { trustCredentials } from "./trust-credentials";
import type { TrustCredential } from "./trust-credentials";
import { contactPageContent } from "./pages/contact";
import type { ContactPageContent } from "./pages/contact";
import { expertisePageContent } from "./pages/expertise";
import type { ExpertisePageContent } from "./pages/expertise";
import { homePageContent } from "./pages/home";
import type { HomePageContent } from "./pages/home";
import { servicesPageContent } from "./pages/services";
import type { ServicesPageContent } from "./pages/services";
import { guidePrices } from "./pricing";
import type { GuidePrice } from "./pricing";
import {
  locations,
  projects,
  serviceTypes,
  services,
  testimonials,
} from "./projects";
import type {
  Location,
  Project,
  Service,
  ServiceType,
  Testimonial,
} from "./projects";
import { siteSettings } from "./site-settings";
import type { SiteSettings } from "./site-settings";

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return homePageContent;
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  return servicesPageContent;
}

export async function getExpertisePageContent(): Promise<ExpertisePageContent> {
  return expertisePageContent;
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  return contactPageContent;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getCredentials(): Promise<Credential[]> {
  return credentials;
}

export async function getGuidePrices(): Promise<GuidePrice[]> {
  return guidePrices;
}

export async function getLocations(): Promise<Location[]> {
  return locations;
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  return serviceTypes;
}
