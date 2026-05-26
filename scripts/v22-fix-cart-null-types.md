# V22 Cart Null Types Fix

Fixed AddToCartButton build error:

`Type 'string | null' is not assignable to type 'string | undefined'`

Changes:
- CartProvider now allows `imageUrl?: string | null`.
- Added clean AddToCartButton.tsx that supports addItem(product, quantity).
- Product page uses AddToCartButton.
