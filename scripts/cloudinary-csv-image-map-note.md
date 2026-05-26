# Cloudinary CSV Image Matching

V50 embeds the uploaded `cloudinary_files.csv` into the website as a static image map.

The website matches images to Zoho Books items using numbers only.

Example Cloudinary file:
`wy-4256x_c1ogbr.webp`

Extracted number:
`4256`

Zoho item that can use it:
`WY 4256X`

The random suffix is accepted because the full `public_id` comes from the CSV.

URL candidates are generated in this order:
1. Root public ID URL, e.g. `/image/upload/wy-4256x_c1ogbr.webp`
2. Folder URL, e.g. `/image/upload/lamitak/wy-4256x_c1ogbr.webp`
3. Existing fallback URL patterns from the product code.

Cloudinary Admin API variables are optional now, because the CSV image map is included in the package.
