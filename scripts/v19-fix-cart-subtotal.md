# V19 Cart Subtotal Fix

Fixed checkout build error:

`Property 'subtotal' does not exist on type 'CartContextValue'`

Changes:
- Added `subtotal: number` to cart context type.
- Added subtotal calculation from item price × quantity.
- Included subtotal in CartProvider value.
