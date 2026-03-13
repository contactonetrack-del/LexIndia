# Theme and i18n Contribution Rules

## Required conventions

- Use locale-prefixed internal routes and `LocaleLink` for public navigation.
- Use semantic theme tokens such as `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `bg-accent`.
- Add route-owned copy to message catalogs or localized content registries instead of embedding English JSX literals.
- Keep message catalogs structurally identical to `messages/en.json`.
- For DB-backed content, provide translation rows for every supported locale before publishing.

## Prohibited patterns

- No raw Tailwind palette utilities in app or shared UI code for surfaces, borders, or text colors.
- No arbitrary hex colors outside approved brand exceptions and the token layer.
- No new JSX text literals in route or shared components unless they are brand names or intentionally allowlisted.
- No new locale without font mapping, metadata coverage, sitemap coverage, and validation updates.

## Required checks

- `npm run typecheck`
- `npm run lint`
- `npm run compliance`
- `npm run build`
- `npm run test:browser`
- `npm run audit:compliance` before large theme or translation refactors
