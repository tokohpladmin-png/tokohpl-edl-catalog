# V18 Format Rupiah Fix

Fixed build error:

`Module "@/components/CartProvider" has no exported member "formatRupiah"`

Changes:
- Added `formatRupiah` export to CartProvider.
- Added `updateQuantity` to CartProvider for checkout/cart compatibility.
