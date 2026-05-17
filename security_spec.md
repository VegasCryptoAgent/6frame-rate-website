# Security Specification - 6Frame Showcase

## Data Invariants
1. A Video must have a `showcaseId`, `title`, `url`, and `order`.
2. Videos are read-only for public users.
3. Only admins can write to the videos collection (but currently no admin auth is set up, so we'll restrict writes to false for now, or use a secret if needed. The skill says `allow write: if false` is a good default if no admin concept exists yet).

## The "Dirty Dozen" Payloads
1. Create a video without `showcaseId`.
2. Create a video with a non-string `title`.
3. Create a video with a negative `order`.
4. Create a video with a URL that is too long (> 2048 chars).
5. Update a video's `showcaseId` (immutable).
6. Delete a video (denied).
7. Inject a huge string (> 128 chars) into `title`.
8. Create a video with a fake `id` that is too long or contains invalid characters.
9. Read a video as a non-authenticated user (should be allowed if public).
10. Update a video as a non-authenticated user (denied).
11. Write a video with extra "shadow" fields.
12. Write a video with an invalid status (if we had one).

## Test Runner (Mock representation)
All of the above should return `PERMISSION_DENIED` for write operations and `SUCCESS` for public reads.
