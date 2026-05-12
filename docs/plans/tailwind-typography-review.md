---
name: typography rollout review
overview: Review where Tailwind Typography fits this Astro marketing site and propose a minimal rollout that only styles true narrative content. Avoid applying `prose` to controlled marketing layouts, cards, forms, and CTA sections where it would fight the existing design system.
todos:
  - id: register-plugin
    content: Register `@tailwindcss/typography` in the web app stylesheet and define a minimal brand-safe prose pattern
    status: pending
  - id: apply-case-study
    content: Wrap the case-study narrative content in `pages/our-work/[slug].astro` with the shared prose styling
    status: pending
  - id: preserve-custom-layouts
    content: Leave forms, cards, timelines, grids, and CTA sections on custom utilities rather than converting them to prose
    status: pending
---

# Tailwind Typography Review

## Recommendation

Use `@tailwindcss/typography` sparingly in this codebase. The app currently has almost no uncontrolled HTML, Markdown, or CMS content, so a broad `prose` rollout would add friction more than value.

## Best Fit

- Enable the plugin in [apps/web/src/styles/global.css](/workspaces/cornwall-ponds/apps/web/src/styles/global.css) because it is installed but not yet registered.
- Create one reusable rich-text style, either as a small utility in [apps/web/src/styles/global.css](/workspaces/cornwall-ponds/apps/web/src/styles/global.css) or a wrapper component under `apps/web/src/components/`, based on a pattern like `prose max-w-none dark:prose-invert` plus a few brand-safe element modifiers for headings and links.
- Apply that wrapper only to the narrative case-study content in [apps/web/src/pages/our-work/[slug].astro](/workspaces/cornwall-ponds/apps/web/src/pages/our-work/[slug].astro). This is the clearest prose-shaped surface because it renders multi-paragraph story content from `project.challenge`, `project.solution`, and `project.result` defined in [apps/web/src/lib/projects.ts](/workspaces/cornwall-ponds/apps/web/src/lib/projects.ts).

## Explicit Non-Targets

Leave these as utility-first custom layouts instead of `prose`:

- [apps/web/src/pages/contact.astro](/workspaces/cornwall-ponds/apps/web/src/pages/contact.astro) and contact components: form-driven UI, not article content.
- [apps/web/src/components/WhyChooseUs.astro](/workspaces/cornwall-ponds/apps/web/src/components/WhyChooseUs.astro): card grid with tightly controlled spacing.
- [apps/web/src/components/HowWeWork.astro](/workspaces/cornwall-ponds/apps/web/src/components/HowWeWork.astro): timeline/cards, not flowing text.
- [apps/web/src/components/services/ServicesDetailBlocks.astro](/workspaces/cornwall-ponds/apps/web/src/components/services/ServicesDetailBlocks.astro): mixed CTA, feature grid, image layout.
- [apps/web/src/components/services/InvestmentGuideSection.astro](/workspaces/cornwall-ponds/apps/web/src/components/services/InvestmentGuideSection.astro): price cards.
- [apps/web/src/components/GetStarted.astro](/workspaces/cornwall-ponds/apps/web/src/components/GetStarted.astro): CTA block.

## Guardrails

- Keep the built-in typography `max-width` overridden with `max-w-none` when used inside existing grid layouts.
- Use `not-prose` for any embedded CTA or custom widget inside a prose container.
- Prefer a brand-aligned wrapper over raw `prose` everywhere, since the site already relies on theme tokens and custom heading/body treatment in [apps/web/src/styles/global.css](/workspaces/cornwall-ponds/apps/web/src/styles/global.css).
- Treat this as future-proofing for later blog/FAQ/CMS content, not as a global restyle of the current marketing site.
