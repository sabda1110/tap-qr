---
name: tap-qr-design-system
description: Design or implement TapQR marketing, customer-facing, and dashboard interfaces. Use for visual components, responsive layouts, interaction design, and design reviews.
---

# TapQR Design System

Use the product context to choose the correct visual density and interaction
style before implementing UI.

## Shared visual language

- Brand name: TapQR. Render `Tap` in near-black and `QR` in the warm yellow
  accent when using the text logo.
- Primary palette: white surfaces, near-black text and primary actions, warm
  yellow `#ffb332` for emphasis, and cyan/teal from the existing illustration
  assets as supporting colors.
- Use Plus Jakarta Sans through the existing global font setup.
- Prefer generous whitespace, bold concise headings, thin hand-drawn decorative
  lines, simple geometric accents, and restrained rounded corners.
- Reuse tokens and existing primitives. Do not introduce one-off colors or
  spacing values when an existing choice fits.

## Context-specific rules

### Marketing/company site

- Visual storytelling and decorative motion are allowed when they support
  conversion and do not obscure the CTA.
- Lead with business outcomes: more Google reviews, customer connection, and
  repeat visits. NFC and QR are the mechanism.
- Keep one dominant CTA and one quieter secondary action per hero.

### Customer-facing UMKM page

- Mobile-first, fast, and focused on one obvious action.
- Minimize decoration, animation, decisions, and text.
- Maintain large touch targets and clear contrast for low-end phones and bright
  environments.

### Admin dashboard

- Prioritize clarity and predictable patterns over decorative visuals.
- Prefer choices, toggles, and sensible defaults over long free-form forms.
- Make outcomes and status understandable to non-technical business owners.
- Use the shared shadcn-style controls before creating a bespoke input, select,
  combobox, dialog, alert, toast, or button.
- Treat destructive actions as visually distinct and pair them with a
  confirmation dialog. Toast success is green, error is red, warning is yellow,
  and informational feedback is cyan.
- Use an intentionally responsive dashboard: desktop sidebar remains within the
  viewport, while mobile exposes navigation through the existing bottom sheet.
- Modal forms keep the title and close control in the header, the form fields
  in the scroll region, and actions in an opaque footer. Mobile actions stack
  with safe-area spacing.
- For social links, show the existing official brand marks and let users choose
  a destination before adding a link. Keep drag handles and move controls clear.

## Responsive and accessible UI

- Design desktop and mobile intentionally; do not rely on simple proportional
  shrinking.
- Prevent decoration from touching copy or controls at every breakpoint.
- Use semantic elements, visible focus states, accessible names, useful alt
  text, and WCAG-conscious contrast.
- Respect reduced-motion preferences for nonessential animation.
- Implement representative desktop and mobile states in code, but leave visual
  browser verification to the user. Do not open or operate a browser unless the
  user explicitly requests browser inspection in the current request.
