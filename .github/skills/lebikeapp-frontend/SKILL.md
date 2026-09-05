---
name: lebikeapp-frontend
description: "Use when building or changing the LebikeApp frontend: MUI screens, service endpoints, mock API responses, authentication, user modules, themes, or glass UI."
---

# LebikeApp Frontend

- Use Material UI for all visual components and keep endpoint paths inside `src/service`.
- Keep `ApiService` as the generic transport/interceptor only. Add one service per backend feature (`AuthService`, `UsersService`, `ModulesService`, `ArticlesService`, etc.); those services call `ApiService` and own their endpoint paths. JSX must never hardcode endpoint paths.
- Keep payloads and responses generic JavaScript objects so backend contract changes remain localized to the service layer.
- Use Vite environment files: `npm run start:local` / `build:local` loads `.env.local` with the mock interceptor; `npm run start:dev` / `build:dev` loads `.env.dev`; `npm run start:prod` / `build:prod` loads `.env.prod`. The local script uses Vite's `development` mode because `local` is reserved by Vite for the `.env.local` suffix. Never commit real credentials or secrets in these files.
- Set `VITE_USE_MOCK_API=true` only for local development. Mock responses belong in `src/service/mockResponses.js` and should mirror `examples-frontend`.
- Keep authentication state out of browser storage. The current frontend-only fallback keeps it in memory; production should use a backend-issued `HttpOnly`, `Secure`, `SameSite` cookie.
- Use a consistent MUI error dialog, responsive light/dark themes, and expose the premium theme only to users whose role is `OWNER`.
- Build the navigation from the `modules/user` service response, rendering `children` as nested menu items and preserving permissions for future route guards.
- Keep `src/App.jsx` focused on providers, route composition, session orchestration, and global error state. Do not define page screens there.
- Put full screens in `src/pages`, persistent authenticated composition in `src/layouts`, and reusable visual/navigation units in `src/components`.
- Keep global horizontal and lateral navigation in the authenticated layout so every authenticated page receives the same shell through composition.
- Use MUI for interface components and a deliberate 2026 visual direction: restrained glass surfaces, expressive typography, strong spacing hierarchy, subtle motion, responsive states, and modern teal, cobalt, and warm gold accents. Avoid generic card grids, purple defaults, and decorative effects without product meaning.
- Define visual colors through MUI theme presets and palette tokens, never by duplicating role/theme color literals in components.
- Theme access is role-controlled: `USER` and `ADMIN` can use `light` and `dark`; `OWNER` can also use `premium`.
- Resolve the authenticated role through `RolesService.findCurrentUserRole()` (`GET /users/me/role`) after login; the local interceptor must provide a mock response for this contract. The backend should later set the authoritative role/session cookie with `HttpOnly`, `Secure`, and `SameSite` flags.
- Keep the lateral navigation opaque and high-contrast so labels and nested options remain readable; the topbar may use a restrained, dense glass effect that never reduces content legibility.
- Use a night-blue and white visual language for light/dark themes. Preserve the premium theme's warm gold direction unless a design request changes it.
- Login may use subtle, low-contrast particles and elegant electric light effects behind the form, but effects must remain decorative, performant, and never compete with inputs or CTA content.
- Treat spacing as a product constraint: define clear margins, gaps, and responsive breakpoints so visual elements never overlap on desktop or mobile.
- Every new screen and layout must be tested for both web and mobile widths, with readable content, stable controls, and no horizontal overflow.

## Visual Composition Rules

- Keep consistent visual breathing room: separate headings, supporting text, fields, buttons, cards, and navigation groups with intentional margins and gaps. Do not allow text or controls to touch neighboring components.
- Prefer MUI `Stack`, `Grid`, `Box` spacing, theme shape, and responsive props for layout. Avoid arbitrary negative margins and absolute positioning for functional content.
- Reserve absolute positioning, pseudo-elements, and animation layers for decorative backgrounds only. They must stay behind content and never cover inputs, labels, buttons, menus, or dialogs.
- The login must use a deep night-blue background, a noticeably lighter login panel with restrained glass, generous internal padding, and the main phrase `Roda con nosotros`.
- Make the Lebike brand clearly visible and slightly larger in both the login screen and the horizontal topbar. Preserve enough surrounding space for the brand to breathe on mobile.
- The lateral menu must be opaque, readable, and collapsible. It should expose a clear arrow control for expand/collapse, keep module icons visible when collapsed, and render nested submodules only when the parent is expanded.
- The horizontal menu may use a subtle, dense glass effect, but its background and contrast must keep the company name, theme selector, profile, and actions readable.
- Login background motion should read as subtle electricity: angular light traces, restrained glow, low opacity, and slow pulses. Particle effects are secondary and must not look like noisy confetti.
- For the Lebike login specifically, the lower storm layer may resolve into a glowing bicycle silhouette at intervals. Keep it behind the card, brief, elegant, blue-toned, and readable as electricity rather than as a static illustration.
- Use night blue and white as the main light/dark visual language. Keep premium as the warm gold theme. Define semantic colors in MUI theme presets and avoid repeating palette literals in components.
- Validate every screen at desktop and mobile widths. Text must wrap cleanly, controls must remain usable, cards must not overlap, and the page must not introduce horizontal scrolling.
