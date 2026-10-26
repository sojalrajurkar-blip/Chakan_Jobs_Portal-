# Chakan Job Portal — Frontend Design Tokens & UI/UX Specification
**Version:** 1.0  
**Date:** 26 October 2026  
**Purpose:** Translate the supplied Chakan Job Portal PRD/SRS and the JobTree Dribbble reference into a practical, implementation-ready frontend design system.

## 1. Source of truth and design direction

### Project documents reviewed
- `Chakan_Job_Portal_PRD(1).md` — product vision, user roles, MVP scope, UX requirements, responsive behaviour, and delivery phases.
- `Chakan_Job_Portal_SRS.md` — proposed React frontend + Django backend architecture, functional requirements, security, accessibility, and acceptance criteria.

### Visual reference
- Dribbble: [JobTree — A Hyperlocal Salon Hiring App](https://dribbble.com/shots/27144198-JobTree-A-Hyperlocal-Salon-Hiring-App)

The Dribbble page exposes this reference palette: `#DDE5E0`, `#0A0733`, `#BBBBCF`, `#E0C75C`, `#413E57`, `#EFB817`, `#716D8D`, and `#9A9BA1`. The reference is a *salon hiring app*, so borrow its palette and the idea of a friendly, locally relevant hiring experience—not salon-specific content or an assumption that its exact layouts suit this portal.

**Recommended direction for Chakan Job Portal:** clean, approachable, locally focused, and trustworthy. Use a deep ink/navy for structure and legibility, muted sage surfaces to soften the interface, and a restrained warm-gold accent for highlights. The result should feel modern without looking like a generic corporate dashboard.

> Important: The exact visual layout of the Dribbble shot may not be fully available as text. The palette above is grounded in the page; the component rules and token values below are recommendations derived from the PRD/SRS and adapted to this product, not claims that every value appears in the reference.

## 2. Product UX principles

1. **Local relevance first:** make job title, company, location/industrial area, salary (when available), shift, and experience easy to scan.
2. **Fast path to action:** primary candidate action is **Search jobs** / **Apply**; primary recruiter action is **Post a job** / **Manage applicants**.
3. **Trust through clarity:** show accurate job information, clear application instructions, visible form validation, and honest success/error feedback.
4. **Mobile-first:** search, filters, job cards, job details, and application form must work on small screens without horizontal scrolling.
5. **Accessible by default:** readable contrast, keyboard-operable controls, visible focus, semantic headings, associated labels, and meaningful errors.
6. **No false functionality:** do not show optional features as active unless approved and implemented. Candidate accounts, resume upload, saved jobs, notifications, and application status tracking are optional in the supplied PRD/SRS.
7. **Keep motion subtle:** use short transitions for focus, hover, dropdowns, and drawers; never rely on animation to communicate essential state.

## 3. Design tokens

The tokens below are a recommended starting system. Verify contrast and tune them during implementation; do not treat them as existing project values.

### 3.1 Color palette

| Token | Value | Use |
|---|---|---|
| `color.brand.ink` | `#0A0733` | Main brand/nav color, strong headings, high-emphasis text |
| `color.brand.ink-soft` | `#413E57` | Secondary headings, navigation support, dark UI surfaces |
| `color.brand.sage` | `#DDE5E0` | Soft tinted backgrounds, feature panels, subtle sections |
| `color.brand.lavender-muted` | `#BBBBCF` | Secondary decorative accents and subdued selected surfaces |
| `color.brand.purple-muted` | `#716D8D` | Supporting accent, secondary icons, muted emphasis |
| `color.brand.gold` | `#E0C75C` | Highlight, selected marker, decorative emphasis |
| `color.brand.gold-strong` | `#EFB817` | Small high-visibility accent; use sparingly |
| `color.neutral.gray` | `#9A9BA1` | Disabled or low-priority UI only after contrast is checked |
| `color.surface.page` | `#F7F8F6` | Main page background |
| `color.surface.card` | `#FFFFFF` | Job cards, forms, panels, dialogs |
| `color.surface.subtle` | `#EEF2EF` | Search containers, filter backgrounds, alternate sections |
| `color.text.primary` | `#17172A` | Body text and labels |
| `color.text.secondary` | `#5F6070` | Supporting copy, metadata |
| `color.text.inverse` | `#FFFFFF` | Text on sufficiently dark backgrounds |
| `color.border.default` | `#DDE1E3` | Standard borders and dividers |
| `color.border.strong` | `#B9C0C3` | Stronger field boundaries where required |
| `color.state.success` | `#237A52` | Successful submission and positive feedback |
| `color.state.success-bg` | `#EAF6EF` | Success banners |
| `color.state.warning` | `#8A5A00` | Warnings and caution messages |
| `color.state.warning-bg` | `#FFF5D9` | Warning banners |
| `color.state.error` | `#B42318` | Errors and invalid fields |
| `color.state.error-bg` | `#FEF0EE` | Error banners |
| `color.state.info` | `#245EA8` | Informational messages |
| `color.state.info-bg` | `#EEF5FF` | Informational banners |

**Color rules**
- Use ink/navy as the main structural color; sage is a supporting surface, not a replacement for white space.
- Gold is an accent, not a large body-text background. Avoid white text on gold unless contrast is proven.
- Do not use muted gray for important text or controls unless the contrast ratio is adequate.
- Never communicate status through color alone; include text and/or an icon.
- Verify WCAG contrast, especially for button labels, muted metadata, and focus rings.

### 3.2 Typography

Recommended web-safe font stack:
- **Primary:** `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Optional display accent:** use the same family with heavier weight; avoid introducing a second font unless branding assets justify it.

| Token | Size | Line height | Weight | Usage |
|---|---:|---:|---:|---|
| `type.display` | `48px` / `3rem` | `1.1` | 700 | Homepage hero on wide desktop |
| `type.h1` | `36px` / `2.25rem` | `1.2` | 700 | Page title |
| `type.h2` | `28px` / `1.75rem` | `1.25` | 650–700 | Main section headings |
| `type.h3` | `22px` / `1.375rem` | `1.3` | 600 | Job title/card heading |
| `type.h4` | `18px` / `1.125rem` | `1.4` | 600 | Panel headings |
| `type.body-lg` | `18px` / `1.125rem` | `1.6` | 400 | Hero description, lead copy |
| `type.body` | `16px` / `1rem` | `1.5` | 400 | Main body text and form controls |
| `type.body-sm` | `14px` / `0.875rem` | `1.5` | 400 | Job metadata, secondary copy |
| `type.caption` | `12px` / `0.75rem` | `1.4` | 500 | Small timestamps and helper text only |

**Typography rules**
- Use sentence case, plain language, and short labels.
- Keep job titles visually prominent; company and location should be the next information tier.
- Do not use caption-sized text for required instructions, errors, or essential job information.
- On small screens, reduce the hero display size to approximately `34–38px`.

### 3.3 Spacing scale

Use a 4px base spacing system.

| Token | Value | Typical use |
|---|---:|---|
| `space.0` | `0px` | Reset |
| `space.1` | `4px` | Icon-to-label gap |
| `space.2` | `8px` | Compact internal gap |
| `space.3` | `12px` | Small control spacing |
| `space.4` | `16px` | Standard gap and card padding on mobile |
| `space.5` | `20px` | Form field separation |
| `space.6` | `24px` | Card padding and component groups |
| `space.8` | `32px` | Section subgroups |
| `space.10` | `40px` | Major content gaps |
| `space.12` | `48px` | Compact section spacing |
| `space.16` | `64px` | Desktop section spacing |
| `space.20` | `80px` | Large hero/section separation |
| `space.24` | `96px` | Large desktop section spacing |

### 3.4 Layout and responsive breakpoints

| Token | Value | Behaviour |
|---|---:|---|
| `layout.content-max` | `1200px` | Maximum centered content width |
| `layout.reading-max` | `760px` | Long-form job descriptions and forms |
| `layout.page-gutter-mobile` | `16px` | Small screens |
| `layout.page-gutter-tablet` | `24px` | Tablet |
| `layout.page-gutter-desktop` | `32px` | Desktop |
| `breakpoint.sm` | `640px` | Small mobile/large phone transition |
| `breakpoint.md` | `768px` | Tablet layout transition |
| `breakpoint.lg` | `1024px` | Desktop layout transition |
| `breakpoint.xl` | `1280px` | Wide desktop content |

Responsive rules:
- **Mobile (<768px):** one-column job list; filters in a drawer or collapsible panel; full-width primary actions; stack form fields; keep search visible near the top.
- **Tablet (768–1023px):** use a compact two-column layout only when the content remains readable; filters may occupy a narrow side panel.
- **Desktop (≥1024px):** centered max-width container; job results and filters can use a two-column layout; dashboard navigation may use a sidebar.
- Never require horizontal scrolling for the main page at common device widths.

### 3.5 Radius, borders, and elevation

| Token | Value | Use |
|---|---:|---|
| `radius.sm` | `6px` | Chips, small controls |
| `radius.md` | `10px` | Inputs, buttons, compact cards |
| `radius.lg` | `16px` | Job cards and panels |
| `radius.xl` | `24px` | Hero panels and feature containers |
| `radius.pill` | `999px` | Tags and filter chips |
| `border.width` | `1px` | Standard border |
| `shadow.card` | `0 4px 16px rgba(10, 7, 51, 0.06)` | Resting cards |
| `shadow.card-hover` | `0 10px 28px rgba(10, 7, 51, 0.10)` | Hoverable cards |
| `shadow.popover` | `0 16px 40px rgba(10, 7, 51, 0.16)` | Dropdowns and dialogs |

Use borders and surface contrast as the primary grouping method. Shadows should remain soft and infrequent.

### 3.6 Buttons and interactive controls

| Token | Value |
|---|---|
| `control.height-sm` | `36px` |
| `control.height-md` | `44px` |
| `control.height-lg` | `52px` |
| `control.min-touch-target` | `44px` recommended for touch controls |
| `control.focus-ring` | `0 0 0 3px rgba(36, 94, 168, 0.25)` |
| `control.transition` | `160ms ease` |

Button variants:
- **Primary:** ink background, white label; used for Search Jobs, Apply, Post a Job, Save Changes.
- **Secondary:** white/surface background, ink text, subtle border; used for View Details, Cancel, secondary navigation.
- **Accent:** gold accent for small emphasis only; ensure contrast and avoid making every button gold.
- **Danger:** error red; only for destructive actions such as Delete Job.
- **Text/Ghost:** transparent background; use for low-emphasis actions such as Clear filters.

States required: default, hover, focus-visible, active, disabled, loading. Loading must prevent accidental repeated submissions and use a clear label/spinner.

### 3.7 Form field tokens

| Token | Value |
|---|---|
| `field.height` | `44px` minimum |
| `field.padding-x` | `12px` |
| `field.radius` | `10px` |
| `field.border` | `#DDE1E3` |
| `field.border-focus` | `#245EA8` |
| `field.border-error` | `#B42318` |
| `field.label-gap` | `6px` |
| `field.help-gap` | `6px` |

Form rules:
- Every input must have a visible label; placeholders are examples, not labels.
- Show inline errors beside the relevant field and summarize errors where helpful.
- Preserve entered values when server validation fails.
- Use suitable input types for email, phone, numbers, password, and URLs.
- Add `required` indicators and explain formats or constraints before submission.
- Do not display a success message until the backend confirms the record was saved.

### 3.8 Motion

| Token | Value |
|---|---|
| `motion.fast` | `120ms` |
| `motion.normal` | `160ms` |
| `motion.slow` | `240ms` |
| `motion.easing` | `cubic-bezier(0.2, 0, 0, 1)` |

Keep motion limited to hover/focus feedback, dropdowns, filter drawers, and small state changes. Respect `prefers-reduced-motion`.

## 4. Required frontend screens and components

The following are based on the supplied PRD/SRS MVP. Optional features are marked separately.

### 4.1 Public experience
1. **Homepage**
   - Header: logo/portal name, Browse Jobs, Post a Job, HR Login.
   - Hero: locally relevant headline, short supporting text, prominent job search.
   - Search controls: keyword/job title and location/area; expand to filters where appropriate.
   - Featured/recent jobs list with real data.
   - Trust/help section explaining the portal’s local purpose.
   - Footer with contact/help links and relevant policies where available.
2. **Job listing/search results**
   - Search query summary, result count when available, sorting/pagination if implemented.
   - Filters supported by available data: area/location, job type, salary range, education, experience, shift.
   - Job cards with title, company, location, salary range if provided, shift/type, experience, and View Details action.
   - Loading skeleton, no-results state, error state, and clear-filters action.
3. **Job detail**
   - Job title, company, location, salary range, openings, shift, education, experience, description, and application instructions when available.
   - Clear Apply action for open jobs.
   - Do not invent missing salary or company details; show “Not specified” or omit the field according to product rules.
4. **Candidate application**
   - Only the approved fields needed to apply.
   - Required-field validation, safe error handling, submitting state, and confirmed success state.
   - Resume upload is optional and must not be shown as active until approved and implemented.

### 4.2 Recruiter / HR experience
5. **HR registration and login**
   - Simple, focused forms with password visibility toggle if implemented, validation, loading state, and error feedback.
   - Do not expose account secrets or reveal sensitive authentication details in error messages.
6. **HR dashboard**
   - Summary cards may show active jobs and total applications only if reliable API data exists.
   - Job management table/list: title, status, date, applications, actions.
   - Empty state with a clear Post a Job action.
7. **Create/edit job**
   - Group fields into Job Details, Requirements, Compensation/Shift, and Company/Location.
   - Validate salary ranges, openings, and required fields on both client and server.
   - Save draft/publish actions only if the backend supports those states.
8. **Applicants for a job**
   - Applicant list scoped to the recruiter’s own job posts.
   - Show only approved application data; use readable empty/loading/error states.
   - Enforce object-level authorization in the backend—hiding a UI link is not security.
9. **Admin**
   - Use Django/admin capability or a dedicated interface only as defined by the implementation plan.
   - Restrict access to authorised administrators; do not treat the HR dashboard as an admin panel.

### 4.3 Optional enhancements — do not assume they are approved
- Candidate account/profile.
- Resume upload/download.
- Application history/status tracking.
- Saved jobs.
- Email notifications.
- Recruiter analytics.
- Job expiry, approval/moderation, advanced sorting, and enhanced SEO.

## 5. Component inventory

Build reusable React components rather than styling each page independently.

- `AppShell`, `SiteHeader`, `MobileNavigation`, `SiteFooter`
- `PageContainer`, `SectionHeading`, `Breadcrumbs`
- `JobSearchBar`, `KeywordInput`, `LocationSelect`, `FilterPanel`, `FilterChip`, `SortSelect`
- `JobCard`, `JobMeta`, `SalaryLabel`, `ShiftBadge`, `JobStatusBadge`
- `JobList`, `JobListSkeleton`, `EmptyState`, `ErrorState`, `Pagination`
- `JobDetailHeader`, `JobDescriptionSection`, `ApplyPanel`
- `FormField`, `TextInput`, `SelectField`, `TextareaField`, `CheckboxField`, `PasswordField`
- `InlineError`, `FormErrorSummary`, `Toast/Alert`, `LoadingButton`
- `AuthCard`, `DashboardShell`, `DashboardSidebar` or `DashboardNav`
- `StatCard` (only where real metrics exist), `JobManagementTable`, `ApplicantList`
- `ConfirmDialog` for destructive actions
- `FilterDrawer` for mobile

Use semantic HTML, consistent prop naming, and shared design tokens. Avoid duplicating business logic inside presentational components.

## 6. Suggested page layouts

### Homepage desktop
- Top navigation in a white or subtle-sage surface.
- Hero with strong headline and a compact search panel.
- Latest jobs section below; use a readable list/card layout rather than oversized decorative graphics.
- Secondary information sections should not push the search action too far down the page.

### Job search desktop
- Search bar across the top.
- Filter column on the left and job results on the right.
- Job cards show essential details without forcing users to open each listing to discover location or shift.
- Keep filters available without making the result area cramped.

### Job detail desktop
- Main job description in the primary column.
- Compact Apply panel in the secondary column, sticky only if it does not obscure content.
- On mobile, stack the Apply panel and consider a clear bottom action only if it does not cover content or keyboard focus.

### HR dashboard
- Consistent header and dashboard navigation.
- Main content starts with page title and primary action.
- Use tables on wide screens and stacked cards on mobile.
- Destructive actions must be clearly differentiated and confirmed.

## 7. Content and writing style

Use clear, simple English initially; support Marathi or other languages only after the language requirement is confirmed.

Suggested tone:
- Helpful, local, direct, and professional.
- Avoid exaggerated marketing claims such as “guaranteed job.”
- Use action labels: “Search jobs”, “View details”, “Apply for this job”, “Post a job”, “View applicants”, “Save changes”.
- Empty state example: “No jobs match these filters. Try another location or clear some filters.”
- Application confirmation example: “Your application has been submitted successfully.” Show this only after the backend confirms persistence.
- Error example: “We couldn’t submit your application. Check the highlighted fields and try again.”

## 8. Accessibility and interaction requirements

- Meet WCAG AA contrast targets where practical and verify with a contrast checker.
- Keyboard access for navigation, filters, dialogs, dropdowns, pagination, and forms.
- Clearly visible `:focus-visible` styling.
- Associate labels, help text, and errors with form controls.
- Use semantic buttons for actions and links for navigation.
- Dialogs/drawers must manage focus and return focus when closed.
- Announce dynamic result counts and form feedback with suitable live-region semantics.
- Ensure status badges have text labels and do not depend only on colour.
- Test at 320px, 375px, 768px, 1024px, and 1440px widths.
- Respect reduced-motion settings.

## 9. UI states that must be designed

Every data-driven page should account for:
- Initial/loading state.
- Populated/success state.
- Empty state.
- Validation error state.
- API/network error state with retry where appropriate.
- Disabled state.
- Permission-denied state for protected recruiter/admin resources.
- Not-found or closed-job state for unavailable jobs.
- Submission-in-progress state that prevents duplicate submission.

## 10. Implementation handoff

### Recommended CSS variable starter

```css
:root {
  --color-brand-ink: #0A0733;
  --color-brand-ink-soft: #413E57;
  --color-brand-sage: #DDE5E0;
  --color-brand-lavender-muted: #BBBBCF;
  --color-brand-purple-muted: #716D8D;
  --color-brand-gold: #E0C75C;
  --color-brand-gold-strong: #EFB817;

  --color-page: #F7F8F6;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #EEF2EF;
  --color-text-primary: #17172A;
  --color-text-secondary: #5F6070;
  --color-border: #DDE1E3;

  --color-success: #237A52;
  --color-success-bg: #EAF6EF;
  --color-warning: #8A5A00;
  --color-warning-bg: #FFF5D9;
  --color-error: #B42318;
  --color-error-bg: #FEF0EE;
  --color-info: #245EA8;
  --color-info-bg: #EEF5FF;

  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --content-max: 1200px;
  --reading-max: 760px;
  --control-height: 44px;
  --focus-ring: 0 0 0 3px rgba(36, 94, 168, 0.25);
  --shadow-card: 0 4px 16px rgba(10, 7, 51, 0.06);
  --shadow-card-hover: 0 10px 28px rgba(10, 7, 51, 0.10);
  --transition-normal: 160ms ease;
}
```

### Recommended React/frontend implementation rules
- Keep token values centralised; do not scatter raw colours and spacing values across components.
- Use shared components and variants for buttons, fields, cards, badges, alerts, and empty states.
- Connect all job and applicant content to backend data; do not leave hard-coded demo content in production paths.
- Match the frontend to the actual API contract and handle loading, errors, empty results, and permissions.
- Do not store passwords or secrets in frontend code or local storage.
- Do not rely on frontend checks alone for authorization, job ownership, or applicant privacy.
- Keep resume storage, candidate accounts, saved jobs, notifications, and application status hidden or clearly marked as unavailable until approved and implemented.

## 11. Acceptance checklist

### Visual consistency
- [ ] All pages use the shared palette, type scale, spacing, radius, and elevation tokens.
- [ ] Primary/secondary/danger actions are visually consistent.
- [ ] Cards, forms, badges, alerts, and dashboard panels share consistent rules.
- [ ] No low-contrast essential text or controls.

### Candidate workflow
- [ ] Candidate can browse and search published jobs.
- [ ] Supported filters work and can be cleared.
- [ ] Job detail displays available job fields accurately.
- [ ] Candidate can submit a valid application.
- [ ] Invalid form values show clear errors.
- [ ] Success appears only after a confirmed backend save.

### Recruiter workflow
- [ ] HR can register and sign in securely.
- [ ] Recruiter can create, view, edit, close, and delete only authorised posts, according to the implemented scope.
- [ ] Recruiter can view applicants for their own jobs only.
- [ ] Empty, loading, permission, and API error states are present.

### Responsive and accessibility
- [ ] Tested at mobile, tablet, and desktop widths.
- [ ] No horizontal overflow in core flows.
- [ ] Keyboard navigation and visible focus work.
- [ ] Forms have associated labels and useful errors.
- [ ] Motion respects reduced-motion preference.

### Scope control
- [ ] Optional PRD/SRS features are not silently treated as committed MVP requirements.
- [ ] UI labels and actions match implemented backend capabilities.
- [ ] The existing project's technical structure and API contract are checked before replacing or restructuring code.

## 12. References

- Supplied `Chakan_Job_Portal_PRD(1).md` (CHJ-PRD-001, v1.0, 26 October 2026).
- Supplied `Chakan_Job_Portal_SRS.md` (CHJ-SRS-001, v1.0, 26 October 2026).
- [JobTree — A Hyperlocal Salon Hiring App, Dribbble](https://dribbble.com/shots/27144198-JobTree-A-Hyperlocal-Salon-Hiring-App) — reference palette and general visual inspiration.

---
**Design decision:** Use the JobTree palette as inspiration, but prioritise the Chakan Job Portal's real workflows: job discovery, readable job details, accessible applications, and secure recruiter management.
