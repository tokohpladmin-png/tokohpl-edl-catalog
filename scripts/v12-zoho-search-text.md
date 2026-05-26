# V12 Zoho Search Fix

The debug result showed Zoho is connected, but page 1 contains GREENLAM items and no EDL matches.

V12 changes product fetching:
1. Search Zoho Books items directly using `search_text=ZOHO_EDL_SEARCH_TERM`.
2. Filter results by EDL term across name, SKU, brand, code, and description.
3. Fallback to full-page scanning only if search returns no items.
4. Default recommended `ZOHO_MAX_PAGES=100`.

Recommended Hostinger env:
`ZOHO_EDL_SEARCH_TERM=EDL`
`ZOHO_MAX_PAGES=100`
