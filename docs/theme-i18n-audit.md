# Theme and Multilingual Compliance Audit

Generated on 2026-03-13T04:04:42.760Z

## Summary

- Theme scan violations: 0
- Hardcoded JSX copy findings: 0
- Hardcoded copy-constant findings: 0
- Disallowed locale fallback routes: 0
- Catalog validation issues: 0
- Same-as-English catalog findings: 0
- Content registry issues: 0

## Theme Gaps

- None

Root causes:
- Direct use of palette utilities such as `bg-blue-50`, `text-gray-600`, and hex colors.
- Shared components bypassing semantic tokens and theme primitives.
- Page-level CTA and card implementations re-declaring surface and accent colors instead of inheriting them.

## Multilingual Gaps

JSX literal issues:
- None

Copy-constant issues:
- None

Disallowed locale fallbacks:
- None

Catalog issues:
- None

Same-as-English findings:
- None

Root causes:
- Route components still embed English copy directly in JSX.
- Route and component files still embed English strings inside local copy objects/constants.
- Some public routes still rely on RouteLocaleFallback instead of real localized implementations.
- Translation catalogs are incomplete for some marketing and dashboard copy paths.
- Seeded DB content currently falls back to English variants for non-English locales until curated translations are supplied.

## Detection and Enforcement

- Locale routing is enforced via middleware redirects to locale-prefixed URLs.
- Theme preference is persisted in cookies and injected before hydration.
- Compliance scripts now scan theme classes, catalog parity, placeholder integrity, content registries, and JSX literals.
- CI should fail when violations exceed the recorded baseline or when catalog/content validation returns hard errors.
