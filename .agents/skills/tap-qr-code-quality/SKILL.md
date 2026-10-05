---
name: tap-qr-code-quality
description: Write, review, or refactor maintainable TypeScript and React code in the tap-qr repository. Use for feature implementation, component creation, cleanup, and code review.
---

# TapQR Code Quality

Keep code easy to scan, change, test, and remove.

## File boundaries

- Keep every hand-written source file at or below 300 lines, including tests,
  styles, configuration, and scripts. Generated files and vendored assets are
  exempt.
- Treat 300 lines as a hard ceiling, not a target. Split earlier when a file has
  more than one responsibility.
- Extract by responsibility: data/types, state, presentation, reusable UI, and
  side effects. Do not split into tiny pass-through files merely to satisfy the
  limit.
- Keep route files thin. They connect URL state to a Page and should not contain
  complete page markup.

## Implementation quality

- Use strict TypeScript. Avoid `any`; prefer narrow types, unions, and inference.
- Name components and functions after their responsibility. Avoid vague names
  such as `data`, `item`, `handleThing`, or `utils` when a precise name exists.
- Keep components focused. Move repeated stateful behavior into hooks and pure
  transformations into small functions.
- Prefer early returns and simple control flow over deep nesting.
- Reuse existing components and dependencies before adding new abstractions or
  packages.
- Remove unused code, stale comments, and abandoned variants during the change.
- Comments explain decisions or constraints, not what readable code already
  says.

## Atomic design

- Elements are the smallest reusable UI units.
- Molecules combine elements for one compact purpose.
- Organisms are complete interface sections such as header, hero, or footer.
- Layouts arrange slots and structure without business copy or actual assets.
- Pages inject actual data, locale content, assets, and organisms into layouts.
- Routes connect URLs to Pages.

## Verification

- Run TypeScript checks after code changes.
- Run the production build for changes affecting routing, rendering, imports, or
  bundling.
- Do not open or operate a browser for previews or visual QA unless the user
  explicitly requests browser inspection in the current request. Do not start a
  development server solely for visual inspection.
- For UI changes, implement the relevant responsive states and tell the user
  what they should verify manually on desktop and mobile.
- Do not add tests that only duplicate the implementation. Add tests when they
  protect meaningful behavior or an important edge case.
