# V8 Debug Route Fix

Restored `EDL_COLLECTION_GROUPS` export in `src/lib/products.ts`.

This fixes:
`src/app/api/debug-collections/route.ts`
which still imports `EDL_COLLECTION_GROUPS`.
