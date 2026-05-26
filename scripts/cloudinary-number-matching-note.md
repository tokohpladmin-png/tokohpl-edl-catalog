# Cloudinary Numeric Image Matching

V46 can read Cloudinary image public IDs on the server using the Cloudinary Admin/Search API.

It extracts numeric design codes from filenames.

Example Cloudinary public ID:
`wya-15291mt_bxdgxv`

Extracted number:
`15291` -> base family `5291`

Any Zoho item code containing the same base number can use that image.

This solves random Cloudinary suffixes such as `_bxdgxv`, because the website no longer needs to guess the exact public ID.
