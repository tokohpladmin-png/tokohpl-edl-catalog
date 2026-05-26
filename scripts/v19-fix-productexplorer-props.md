# V19 Fix ProductExplorer Props

Fixed build error:

`Property 'filterOptions' does not exist on type 'ProductExplorerProps'.`

ProductExplorer now accepts optional `filterOptions` for backward compatibility,
while still applying the new filter rules:
- Size uses `sizeMm`
- Category uses `colorFamily`
- Finish filter is not displayed
