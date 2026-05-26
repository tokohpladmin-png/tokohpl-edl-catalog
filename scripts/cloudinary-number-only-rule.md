# Cloudinary Number-Only Image Rule

V48 uses Cloudinary Admin/Search API to read actual uploaded image public IDs.

It extracts 4- or 5-digit numbers from Cloudinary filenames and Zoho Books item codes.

Example Cloudinary image:
`https://res.cloudinary.com/varindo/image/upload/v1779704725/wy-4256x_c1ogbr.webp`

Public ID:
`wy-4256x_c1ogbr`

Extracted number:
`4256`

Zoho item examples that can use it:
- `WY 4256X`
- any Lamitak item code containing `4256`

This rule ignores prefix, suffix, random Cloudinary suffixes, and file extension. It relies on the shared number code.
