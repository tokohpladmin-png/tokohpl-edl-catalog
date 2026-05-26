# V52 Layout Fix

Fixed duplicate body className attributes in src/app/layout.tsx.

Previous broken version:
`<body className="min-h-screen font-sans antialiased" className={manrope.className}>`

Fixed version:
`<body className={`${manrope.className} min-h-screen font-sans antialiased`}>`
