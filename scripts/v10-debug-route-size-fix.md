# V10 Debug Route Size Fix

Fixed build error in `src/app/api/debug-collections/route.ts`.

Cause:
The debug route referenced `product.sizeMm`, but the Product type uses `size`.

Fix:
Replaced `sizeMm` with `size`.
