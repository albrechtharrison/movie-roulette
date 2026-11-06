/**
 * TMDB's full provider list for a region includes hundreds of niche rent/buy
 * storefronts and add-on channels. These are the well-known subscription
 * services most users actually mean by "what streaming service do you have" —
 * shown first, with the full list available behind a "show all" toggle.
 * IDs are stable across TMDB regions/renames.
 */
export const MAJOR_PROVIDER_IDS = new Set([
  8, // Netflix
  9, // Amazon Prime Video
  337, // Disney Plus
  1899, // Max (HBO Max)
  15, // Hulu
  350, // Apple TV+
  531, // Paramount+
  386, // Peacock
  387, // Peacock Premium
  43, // Starz
  37, // Showtime
  2, // Apple TV Store
  10, // Amazon Video
  192, // YouTube
  283, // Crunchyroll
  528, // ESPN+
  526, // AMC+
  73, // Tubi
  300, // Pluto TV
  257, // fuboTV
]);
