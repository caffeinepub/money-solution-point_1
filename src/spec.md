# Specification

## Summary
**Goal:** Build a daily visitor tracking app for “MONEY SOLUTION POINT” that stores visitor entries with backend-generated timestamps and enables Admin-only export.

**Planned changes:**
- Add a visitor entry form (visitor name, contact/phone, organization/bank, purpose/remarks) and persist submissions as records.
- Implement backend-generated auto timestamps on record creation and display them in the records list/table.
- Add an Admin login/logout flow protected by the exact password `9533`, with clear Admin mode indicator and English error messaging on invalid password.
- Provide Admin-only client-side export/download of all records as CSV and Excel-compatible format, including timestamps.
- Apply a consistent, professional office-admin theme with English UI labels across form, records table, and Admin/export views.

**User-visible outcome:** Users can enter daily visitor details for MONEY SOLUTION POINT and see saved records with timestamps; Admins (password 9533) can log in to download all records as CSV and Excel-compatible files.
