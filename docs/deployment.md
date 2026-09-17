# Deployment

The site is published to GitHub Pages from GitHub Actions. Repository
`uapcent/Test_cards`, public, free plan. Live at
<https://uapcent.github.io/Test_cards/>.

## How it works

`.github/workflows/deploy.yml` runs on every push to `main` and on demand:

1. `npm ci`
2. `npm run build` — writes `dist/`, about 15 MB
3. uploads `dist/` as a Pages artifact and deploys it

A run takes roughly half a minute. Pages is set to **build from GitHub Actions**,
not from a branch. This matters: the branch mode would try to serve the repository
as-is, and `index.html` at the root is a Vite entry point that refers to
`/src/main.jsx`, which only exists during development. Switching Pages back to
branch mode would break the live site.

Because the site is served from a sub-path, `vite.config.js` sets
`base: "/Test_cards/"`. Changing the repository name means changing that too.

## Checking a deploy

```bash
gh run list --workflow=deploy.yml --limit 3
```

The live page names its bundle with a content hash, so comparing that hash with
the local `dist/assets/` tells you whether what is live is what you built.

## Pushing is the awkward part

Large pushes to this repository fail from the owner's connection: GitHub answers
`HTTP 408` after about 17 seconds, having accepted only tens of kilobytes. It is
not size-proportional — 11 MB, 2.5 MB and 700 KB pushes all failed the same way,
while small ones went through immediately. SSH is not set up, and neither
`http.postBuffer`, `http.version HTTP/1.1` nor smaller batches fixed it reliably.

What has worked:

- **Keep commits small.** Text-only commits push without trouble.
- **Split image-heavy work** into several commits and push them one at a time.
  This is why the history contains twenty-five commits named "Add figure cutouts,
  part N".
- **Try again later.** The same push that failed repeatedly one evening went
  through the next day, which suggests the problem is transient.

If a push fails, nothing is lost: commit locally, say what is pending, and retry
later rather than fighting it.

There is a fallback if it ever becomes urgent: upload the blobs through the GitHub
API one small request at a time, then create a tree, a commit and move the branch.
Send git's own blob contents rather than the bytes on disk, or line-ending
conversion makes the hashes disagree.

## Branches

`main` is what deploys. Two older branches, `cleanup` and `react-redesign`, hold
the same work under earlier hashes and can be deleted.

## Local build hygiene

`dist/` is git-ignored. Vite is configured with `emptyOutDir: true` but has been
seen leaving files from earlier builds behind locally; `rm -rf dist` before a build
if that matters. It never affects the deploy, which builds on a clean runner.
