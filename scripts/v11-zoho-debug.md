# V11 Zoho Debug

Added `/api/debug-zoho`.

This endpoint bypasses fallback products and checks:
- Whether Zoho environment variables are present
- Whether refresh token can generate access token
- Whether Zoho Books items API works
- How many first-page items match `ZOHO_EDL_SEARCH_TERM`
- Sample item names/codes from Zoho

Use:
`https://tokohpl.com/api/debug-zoho`
