# V9 Debug Route Object Group Fix

Fixed build error in `src/app/api/debug-collections/route.ts`.

Cause:
The debug route expected `EDL_COLLECTION_GROUPS` to contain objects with:
- slug
- title
- collections

V8 used a string array. V9 restores object-style groups and keeps the EDL collection categorization/search fixes.
