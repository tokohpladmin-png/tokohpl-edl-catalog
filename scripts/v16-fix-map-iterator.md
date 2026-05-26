# V16 Fix Map Iterator Build Error

Fixed TypeScript build error in `src/data/edl-product-details.ts`.

Previous:
`for (const [key, detail] of detailsByCode.entries())`

Fixed:
`for (const [key, detail] of Array.from(detailsByCode.entries()))`

This avoids needing `--downlevelIteration` or a higher TS target.
