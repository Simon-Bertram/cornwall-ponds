/**
 * Image reference with mandatory alt text. Mirrors the planned Sanity
 * `imageWithAlt` object so the CMS migration is a drop-in swap
 * (src becomes a Sanity CDN URL).
 */
export interface ImageWithAlt {
  src: string;
  alt: string;
}
