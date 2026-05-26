# WebP Image Rule

V49 prefers WebP image URLs for product images.

Preferred pattern:
- `https://res.cloudinary.com/varindo/image/upload/v1779705153/code.webp`

Fallback patterns:
- `https://res.cloudinary.com/varindo/image/upload/v1779705153/code.jpg`
- `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-code.webp`
- `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-code.jpg`

Cloudinary Admin/Search API matched URLs keep their actual uploaded extension, so if the uploaded asset is `.webp`, the website will use that exact `.webp` URL.
