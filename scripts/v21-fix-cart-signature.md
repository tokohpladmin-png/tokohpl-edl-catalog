# V21 Cart Signature Fix

Fixed AddToCartButton build error:

`Expected 1 arguments, but got 2`

Root fix:
- CartProvider `addItem` now accepts both:
  - `addItem(item)`
  - `addItem(item, quantity)`
- Checkout page uses safe quantity fallbacks.
- CartProvider includes formatRupiah, subtotal, updateQuantity, removeItem, and clearCart.
