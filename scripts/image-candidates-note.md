# Lamitak Image Matching Logic

V45 supports both Cloudinary image patterns:

New root-level pattern:
- `https://res.cloudinary.com/varindo/image/upload/v1779705153/wya-15291mt.webp`
- `https://res.cloudinary.com/varindo/image/upload/v1779705153/code.webp`

Old folder pattern:
- `https://res.cloudinary.com/varindo/image/upload/v1778402032/lamitak/lamitak-code.jpg`

Image matching still uses the numeric design code as the main family key.

Important:
If Cloudinary appends random suffixes such as `_bxdgxv` to the public ID, the website cannot guess that random suffix automatically. For best results, upload files with `unique_filename=false`, or provide/export a mapping file from product code to Cloudinary URL.
