# Specification

## Summary
**Goal:** Update the backend Admin unlock password default to "9533" while preserving any previously persisted Admin password across upgrades.

**Planned changes:**
- Change the default Admin password value in `backend/main.mo` from "MSP9533" to "9533".
- Update upgrade/migration logic so a previously stored Admin password remains unchanged, and only initialize to "9533" when no stored value exists.
- Ensure `unlockAdminPrivileges("9533")` succeeds for authenticated users and `unlockAdminPrivileges("MSP9533")` fails unless explicitly persisted to that value.

**User-visible outcome:** Admin unlock works with password "9533" by default, and existing deployments keep their previously set Admin password after upgrades.
