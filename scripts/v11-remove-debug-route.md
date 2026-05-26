# V11 Remove Debug Route

Removed `src/app/api/debug-collections`.

Reason:
The debug route was an internal testing endpoint from earlier development and kept causing TypeScript build errors due to old field references such as `sizeMm`.

The public site does not need this route.
