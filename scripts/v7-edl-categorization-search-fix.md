# V7 EDL Categorization and Search Fix

Fixes:
- EDL Zoho items now infer categories into:
  Solid, Wood, Marble | Stone, Pattern | Metal, Aptico.
- Collection pages now use these routes:
  /collections/solid
  /collections/wood
  /collections/marble-stone
  /collections/pattern-metal
  /collections/aptico
- Old aliases like /collections/woods, /collections/patterns, and /collections/solids still work.
- Header now includes a visible search bar.
- Search now supports multi-word queries and normalized product-code matching.
