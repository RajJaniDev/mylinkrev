# Dashboard experience update

27 October 2026

## What was getting in the way

Every returning user landed on a long profile settings form. Review credits and QR tools competed with setup. A phone preview consumed space even while reading inquiries. Form configuration appeared before the inbox. Several mutations did not check database errors before indicating success. There was no useful overview of actual inquiries.

## New experience

- **Overview (`/dashboard`)**: welcome, share/copy link, inquiry totals, first-stage count, recent inquiries, setup guidance when incomplete, inquiry availability and free-plan usage. Metrics come from existing leads; no fabricated traffic or conversion analytics.
- **My page (`/dashboard/profile`)**: profile and important links first. Social/contact details, appearance, showcase content, location and Google review links are optional expandable sections. Upgrade options sit at the bottom. The saved-page preview appears only in the editor at suitable widths and reloads after successful saving.
- **Inquiries (`/dashboard/leads`)**: inbox first, with search and stage filters, contact actions and explicit save/error feedback. Stage names can be added, renamed and removed; removal explains reassignment to the first remaining stage.
- **Inquiry form (`/dashboard/leads?tab=form`)**: a separate settings view with a positive “Accept inquiries” switch, service-specific wording, required contact details and clear confirmation copy. Basic contact data is encouraged for astrology consultations; sensitive consultation details can be arranged separately.
- **Navigation**: stable desktop sidebar and scrollable compact mobile navigation; review QR and feedback remain optional. Account controls stay in the top bar. Existing tools remain available.
- **New users**: the two-step audience-based registration stays in a focused welcome card. New profiles hide the optional Google review button by default. Existing users retain their settings.
- **Login**: updated messaging and presentation to match the product and signup experience.

## Save behavior

Profile and form settings use action state with inline errors and success messages. The forms prevent the automatic uncontrolled-field reset on an unsuccessful action, retaining user edits for retry. Pending saves disable the fields. Profile, audience, lead-stage and inquiry settings remain preserved. Selected images are type/size checked. Database update errors are handled explicitly. Saved-data revalidation updates the overview/navigation.

Unsaved changes show a visible status, warn on refresh/close and intercept clicked navigation links. This is not a complete router-history guard: browser Back/Forward still needs separate validation. Inline link creation requires a title and URL; the editor explains that incomplete link cards do not appear publicly.

## Validation

- Final production build (including TypeScript) passed after removing the sample preview.
- TypeScript checks passed during implementation and after final feedback-state refinement.
- Browser-tested actual UI components with synthetic data in a temporary local-only fixture, without creating accounts or touching database records.
- Checked overview, grouped editor, failed profile save retaining edited name, successful save feedback, inbox search/no-results/clear filters, successful stage change updating counts, failed stage change retaining original status, inquiry-form error recovery and success messages.
- The temporary fixture and its public-route exception were removed. No preview route remains in source.
- Screenshots show synthetic data at the available 663px browser width. Exact phone/desktop breakpoint checks and production-authenticated end-to-end persistence remain to be verified.

## Remaining work outside this UI update

Run a controlled signed-in test against the deployed Clerk/Supabase setup: create a profile, save every editor section, reload, submit a test inquiry, move/rename stages and verify ownership isolation. The existing JSON-array storage concurrency concerns and payment lifecycle/data-policy findings in the profitability assessment remain separate work. No database schema or billing-price changes were made, and nothing was deployed.
