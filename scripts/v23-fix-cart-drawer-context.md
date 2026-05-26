# V23 Cart Drawer Context Fix

Fixed CartDrawer build error:

`Property 'isCartOpen' does not exist on type 'CartContextValue'`

Root fix:
- CartProvider now includes:
  - isCartOpen
  - openCart
  - closeCart
  - toggleCart
  - totalItems
  - subtotal
  - formatRupiah
  - addItem(item)
  - addItem(item, quantity)
  - removeItem
  - updateQuantity
  - clearCart
- CartDrawer is rendered inside CartProvider when present.
