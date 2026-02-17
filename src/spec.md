# Specification

## Summary
**Goal:** Persist visitor records in stable canister state so all users and Admins see the same shared dataset across sessions and canister upgrades.

**Planned changes:**
- Move visitor records storage (and next entry ID) from in-memory/client-local usage to stable canister state in the existing Motoko backend actor.
- Add conditional state migration logic to preserve any existing stored visitor records/IDs when upgrading to the new stable storage format.
- Update the Admin records table and export actions to always fetch and use the server-stored shared dataset (no localStorage/sessionStorage as source-of-truth), while keeping existing Admin-only restrictions.

**User-visible outcome:** Visitor records added by any user are saved on the server and are visible to Admin after unlock; records remain available after canister redeploy/upgrade, and Admin table/exports reflect the shared server dataset.
