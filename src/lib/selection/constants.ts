export const VOTE_COUNT_FLOOR = 300;
export const CURATED_POOL_RATIO = 0.7;
// Pages to sample from (20 results/page). Wider than it looks necessary: TMDB's
// popularity ranking barely moves week to week, so a narrow page range means
// repeat picks land on the same handful of blockbusters. 40 pages = ~800 movies
// still sorted by popularity (so still "well-known"), just with real variety.
export const CURATED_POOL_PAGE_COUNT = 40;
export const RANDOM_POOL_PAGE_COUNT = 100;
// How many of the sampled pages' results to merge into one pick's candidate
// list — sampling just 1 page (20 movies) per click was the other half of the
// repetition problem.
export const PAGES_PER_FETCH = 3;
export const MAYBE_LATER_COOLDOWN_DAYS = 30;
export const MAX_DISCOVER_PAGE = 500;
// Client-side, session-only: how many of the most recently shown movies to
// avoid repeating immediately, on top of the pool-size fix above.
export const RECENT_PICKS_BUFFER_SIZE = 20;
