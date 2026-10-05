# Contributing

Thanks for helping improve the Personal Site frontend.

## Workflow

1. Fork the repository (or work on a branch if you have write access).
2. Create a focused branch: `feat/...`, `fix/...`, or `chore/...`.
3. Keep the feature-sliced layout:
   - Routes stay in `src/app`.
   - Page views live in `src/features`.
   - Shared SEO, HTTP, and UI stay in `src/shared` / `src/components`.
   - Copy goes in `src/messages/{en,fa}.json` — never hardcode user-facing strings.
4. Open a pull request against `main`.

## Local checks

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

The companion API is [api_backend_personalsite](https://github.com/seyedWebpro/api_backend_personalsite).

## Commit style

Use a short imperative subject that says **why** the change exists, e.g. `fix: keep locale prefix on 404 pages`.
