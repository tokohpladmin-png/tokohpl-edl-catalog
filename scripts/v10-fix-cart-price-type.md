# V10 Fix

Fixed TypeScript build error in AddToCartButton:
`product.price` can be undefined, so cart now receives `product.price ?? null`.

Also normalized imageUrl, size, and finish values.
