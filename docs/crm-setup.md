# Private CRM: setup and verification

Updated 28 October 2026.

## What is implemented

Dashboard → Contacts now combines manually entered contacts with existing bio-form inquiries. Users can add/edit names, email, phone, company, stage, private notes and a follow-up date; search names/contact details/notes; filter by source or stage; archive/restore records; and export the shown contacts as CSV. Original inquiry messages and source are preserved when editing. Follow-up dates are organizational fields; no automated reminder is sent.

The overview and navigation count active contacts. Manual records are stored separately and do not consume the seven-inquiry public-form allowance. Archiving an inquiry does not reset that allowance. No permanent delete action is provided.

The mobile layout keeps 16px controls, large tap targets, full-width primary actions, and filters collapsed until needed. The local sample-data check measured no horizontal overflow in the 390px contact editor/list.

## Required activation steps

These changes are prepared locally. They do not apply a production migration or create a server credential automatically.

1. In the Supabase project's SQL editor, run `src/db/migrations/20261027_private_crm.sql`. Review the migration first. It creates the private `crm_contacts` table, enables RLS, revokes direct browser-role access, grants server-role access and installs the transactional stage-update function. It also ensures the existing `businesses.leads` column exists.
2. Configure `SUPABASE_SERVICE_ROLE_KEY` in the Next.js server environment for this same Supabase project. Keep it server-only: do not prefix it with `NEXT_PUBLIC_`, commit it, or paste it into chat. For local development, put it in the ignored environment file; in hosting, configure it through the environment-variable settings.
3. Restart the local server or redeploy after configuration. The existing `NEXT_PUBLIC_SUPABASE_URL` must point to the same project as the key.
4. Perform the signed-in checks below with controlled test accounts before customer use.

The reviewed local environment did not contain this server-side key. Without a key, a usable private table, or working database access, the contacts page keeps existing public-form inquiries readable and disables CRM mutations. There is no fallback that writes private notes/manual contacts into public profile JSON. An existing CRM temporarily becoming unavailable also produces this read-only fallback; manual records remain in the private table.

## Ownership and privacy design

The server-only database module is never imported into client components. Each contact action obtains the Clerk session, resolves the business using that authenticated user ID, and scopes all contact queries/writes by that business ID. Request data cannot choose a different owner/business or change a record's original source. Existing records are updated with a version comparison so stale edits do not silently overwrite a newer edit. Source and original messages are copied server-side, not accepted from the client.

New manual contacts and all new private notes live only in `crm_contacts`. Existing bio-form inquiries remain in the pre-existing `businesses.leads` array and are overlaid with private CRM edits. This preserves the current capture flow and allowance. It does **not** remediate the older public-business-table access findings in the profitability audit: historical inquiry data and other public-row fields need a separate migration/privacy review. Never add private notes to `businesses` or `social_links`.

Stage changes run through a server-role-only database function that checks workspace ownership and updates stored contacts, original inquiry stages and stage definitions within one transaction. Other profile settings remain intact.

CSV export is an explicit user action producing a local download, including the records/notes visible under the current filters. Formula-like cell values are prefixed as text. Exports contain personal information and should be handled as client data.

Duplicate email/phone detection is a pre-save convenience for new contacts, not a database-wide unique identity guarantee. There is no deduplication/merge UI. Full concurrent-create idempotency, server-side paginated search and a unified private store for newly submitted bio inquiries remain future work.

## Checks completed

- Pure validation/merge tests: 7 passing via `node --experimental-strip-types --test tests/crm.test.mjs` (Node with TypeScript stripping support).
- Migration and `tests/crm-database.sql` executed in isolated PGlite PostgreSQL with synthetic business rows and Supabase-equivalent role names. Verified role restrictions, owner mismatch rejection, workspace isolation, stage rename/removal reassignment, preserved original message/notes/profile settings, archive/restore and unchanged inquiry count. Test transaction rolled back.
- Browser checks with synthetic in-memory state: add, edit, failed-save recovery, stage changes, follow-up-date save, archive/restore and CSV export. Exported CSV fields, source and follow-up date checked.
- The temporary public QA route and its proxy exception were removed. No production contact records were created/edited, and no production SQL was executed.

## Signed-in acceptance checks after activation

- Account A adds a manual contact with notes and a follow-up date. Reload and verify persistence, source label and overview count.
- Account B cannot see or mutate A's contact, including by submitting A's contact ID to its own actions.
- Edit a bio inquiry and confirm the original submitted message/source remain visible and private notes do not appear in public profiles or browser-accessible database responses.
- Edit in two tabs; saving the stale version must return a refresh/conflict message.
- Archive/restore, reload and verify state; the public-form allowance must remain unchanged.
- Rename/remove a stage; verify original inquiries and private contacts move together while other profile settings remain intact.
- Recheck SQL role grants on the deployed database and confirm the server key is absent from browser bundles/network requests.

PGlite and mocked UI checks are useful validation, but do not replace these checks against the deployed Clerk/Supabase configuration.
