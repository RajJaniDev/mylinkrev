# Landing page and onboarding redesign

27 October 2026

## Implemented

- Warm cream/forest-green marketing design with responsive layouts, reduced-motion support, keyboard focus styles and an interactive sample profile/inquiry preview.
- Homepage centered on bio pages, inquiry capture and simple lead management. Illustrative people and inquiries are labeled; no invented testimonials or growth metrics.
- Dedicated public pages: `/for/coaches`, `/for/creators`, `/for/freelancers`, `/for/astrology`, each with distinct use cases, guidance, metadata and canonical URL.
- Two-step registration: choose your work, then name/link/introduction and opt-in inquiry capture (enabled by default). Audience-specific form titles, button wording and lead stages are stored in existing social_links JSON; no new database columns required.
- Signup preserves the audience starting point in local storage when available. Generic signup remains usable without browser storage.
- Registration validates on the server, derives identity from Clerk, handles duplicate links with a recoverable error, and keeps entered details through errors. Existing accounts redirect to their dashboard.
- Getting-started checklist based on saved profile data, preview link and clipboard action. Copy fallback explains how to select the URL manually. Test inquiries explicitly count against the existing free allowance.
- Lead configuration expanded by default. Saving a profile now preserves audience/lead settings instead of dropping unlisted social_links keys. Dashboard new-lead counts use the configured stages.
- Updated shared footer, About content, default metadata and structured data. Removed global outdated lifetime-pricing and five-star review FAQ claims.
- Sitemap includes audience and tool pages. Sitemap and robots routes explicitly public: they previously redirected signed-out requests to sign-in.
- Existing billing catalog and free allowance remain: seven captured leads. Pro price and billing terms are reviewed from account/checkout rather than advertising an unverified new price.

## Verification

- `npm run build`: passed, including TypeScript and prerendering all four audience pages.
- `npx tsc --noEmit`: passed.
- `git diff --check`: passed.
- Local production HTTP checks: homepage, four audience pages and astrology signup return 200 without auth redirects; audience canonical URLs match; invalid audience returns 404; sitemap contains all four audience URLs; robots and sitemap return 200 publicly.
- Browser: landing page render, profile switching to Astrology, sample inquiry opening, astrology signup query handoff and rendered Clerk UI, dedicated astrology page and FAQ expansion checked.
- Preview at available 663px width had no horizontal overflow. Browser viewport override did not change effective width; exact narrow-phone and desktop visual checks remain unverified. Responsive styles include 1050px, 760px, 500px/420px breakpoints.

## Limits and next checks

No application deployment, payment action or customer record creation was performed. Full authenticated onboarding, successful database inserts, persistence after editing and real lead submission still need a controlled end-to-end check with the deployed Clerk/Supabase policies. The previous profitability assessment's billing and private-data isolation findings remain separate work; this redesign does not resolve all of those issues.

Local Turbopack development preview encountered external-module resolution errors. The production build and `next start` preview worked. The first sandboxed build could not fetch the existing Google font; the authorized network-enabled production build passed. No dependency or secret changes were made.

The marketing is pre-rendered and has targeted content, but organic growth still needs deployment, indexing verification, real customer examples and distribution. No ranking or traffic improvement is claimed from this local change.
