# V18 Header, Filters, Collections Fix

Header:
- Removed Promo menu
- Added Collection menu:
  EDL: Solid, Wood, Marble | Stone, Pattern | Metal, Aptico

Filters:
- Size uses CSV/product field `sizeMm`
- Category uses CSV/product field `colorFamily`
- Finish filter removed

Collections:
- Collection pages now use exact product.collection grouping
- Added combined groups:
  `/collections/marble-stone`
  `/collections/pattern-metal`
- Added `/api/debug-collections` to verify counts
