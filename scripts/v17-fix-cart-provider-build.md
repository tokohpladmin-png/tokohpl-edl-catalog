# V17 Cart Provider Build Fix

Fixed production build error:

`useCart must be used inside CartProvider`

Changes:
- Root layout now wraps the site with `CartProvider`.
- Checkout page is marked dynamic to avoid static prerender issues.
- Existing Remove text in cart-related UI changed to trash icon.
