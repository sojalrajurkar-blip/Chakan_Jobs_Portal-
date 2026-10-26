# Antigravity Master Instructions — Chakan Job Portal
**Purpose:** Improve the existing Chakan Job Portal in small, reviewable phases using the approved PRD and SRS. Antigravity must explain each phase and obtain my explicit approval **before starting that phase**.

---

## 1. Project Context

- **Project:** Chakan Job Portal
- **Existing project:** `chakanJob-main.zip` (extract it and open the project folder in Antigravity).
- **Product requirements:** `Chakan_Job_Portal_PRD.md`
- **Software requirements:** `Chakan_Job_Portal_SRS.md`
- **Backend:** Python + Django
- **API:** Django REST Framework (DRF), subject to the initial architecture review
- **Frontend:** React + Vite
- **Database:** PostgreSQL
- **Deployment:** Client already owns a domain and hosting. Check compatibility before planning deployment. Do not assume the current hosting supports Django/Python, PostgreSQL, or the selected React deployment approach.
- **Important:** The PRD/SRS may contain proposed or optional features. Do not silently treat every proposal as approved scope. Confirm scope with me before implementing optional or costly features.

If the PRD/SRS files are not present, stop and ask me to add them. Do not invent their contents.

---

## 2. Highest-Priority Rule: Approval Gate

**Never start implementation for a phase until I explicitly approve that phase.**

A message such as “review this”, “prepare the plan”, “show me the changes”, or “continue discussing” is **not** approval to implement.

For every phase, use this sequence:

1. Inspect the relevant project files and the approved PRD/SRS.
2. Prepare a **Phase Proposal** using the template in Section 5.
3. Explain in plain language:
   - What you intend to do.
   - Why it is needed.
   - Exactly how you will do it.
   - Which files/modules you expect to create, edit, move, or delete.
   - What you need me to do or provide.
   - What decisions or credentials/access are needed, if any.
   - What could break, the risks, and how you will protect existing work.
   - How you will test it and what “done” means.
   - Estimated effort/complexity (rough estimate only; state assumptions).
4. Identify any uncertainty and ask clear questions. Do not guess on important business, UI, security, data, or deployment decisions.
5. End with a clear request: **“Do you approve Phase X? I will not implement it until you approve.”**
6. Wait for my explicit approval.
7. Only after approval, implement the approved scope. If implementation reveals a new decision, significant scope change, destructive operation, or unexpected risk, stop and ask for approval again.
8. After implementation, test the work and report the results honestly. Do not claim a test passed unless you actually ran it and observed the result.
9. Show changed files, commands run, test results, known limitations, and any actions I need to take.
10. Ask for my acceptance and approval before moving to the next phase.

Approval for one phase does **not** approve the next phase. Do not implement multiple phases at once unless I explicitly approve them together.

### Explicitly prohibited without my separate approval

- Deleting or overwriting important files, data, database tables, uploads, or configuration.
- Running destructive database migrations or resetting a database.
- Changing production settings or deploying to the live domain.
- Making DNS changes, changing hosting plans, or purchasing services.
- Sending emails/SMS to real users or using paid services.
- Adding features outside the approved scope.
- Exposing secrets, API keys, passwords, database credentials, or personal data in logs, source control, reports, or chat.
- Replacing the existing project wholesale before documenting the current architecture and proposing a migration/backup plan.

Never ask me to paste passwords or secret keys into chat. Use environment variables or the hosting provider’s secure secret-management method.

---

## 3. General Working Rules

- Treat the existing code as a client-owned project. Preserve working functionality unless a change is approved.
- Read the PRD and SRS first; use them as the source of truth after I approve their scope.
- Inspect the actual repository before making claims about its structure or behavior.
- Do not assume existing features work just because their code exists. Distinguish **observed in code**, **tested successfully**, **not tested**, and **needs confirmation**.
- Prefer small, reversible changes over large rewrites.
- Before editing, inspect Git status and existing changes. Do not discard or overwrite uncommitted work.
- If Git is not initialized, propose a safe version-control/backup approach and ask before any potentially disruptive setup.
- Do not commit, push, or publish code unless I approve.
- Keep backend API contracts documented and consistent with the React frontend.
- Use secure Django practices, server-side validation, authorization checks, safe file uploads, and password hashing through Django’s authentication system. Never store passwords as plain text.
- Keep secrets out of source code. Use a suitable `.env`/environment-variable approach and provide an example file containing placeholders only.
- Do not place real secrets in `.env.example`, documentation, screenshots, or test fixtures.
- For every feature, consider loading, empty, success, validation-error, permission-error, and server-error states where relevant.
- Make the UI responsive and accessible. Follow the approved design direction; do not make a major design change without presenting it first.
- Avoid installing new dependencies until their purpose, alternatives, and impact have been explained in the phase proposal.
- Keep documentation updated when architecture, setup, API, environment variables, testing, or deployment steps change.
- If a command may modify data, install packages globally, affect the network, or change production, explain it first and obtain approval when the effect is consequential.
- If a requirement is ambiguous, ask rather than silently deciding.
- Do not expose or upload client code or data to external services without my permission.

---

## 4. Suggested Phase Roadmap

This is a **proposed order**, not automatic authorization. Review the PRD/SRS and repository first, then recommend the final phase plan and ask me to approve the roadmap. Adjust the phases if the actual codebase requires it.

### Phase 0 — Requirements and Repository Discovery (read-only)
- Confirm that PRD and SRS are available and summarize their requirements.
- Inspect the repository structure, framework versions, installed dependencies, existing routes/pages, data models, API endpoints, tests, and configuration.
- Identify existing functionality and distinguish confirmed facts from assumptions.
- Check Git status and whether a safe backup/version-control setup exists.
- Review the current hosting information only to determine what facts are needed; do not change hosting or DNS.
- Produce an architecture overview, risk list, questions for me, and recommended phase plan.
- **Default mode:** read-only; do not change application files or install dependencies.

### Phase 1 — Scope, Architecture, UX, and Technical Decisions
- Map PRD/SRS requirements to current features and proposed changes.
- Confirm which features are in scope, optional, or deferred.
- Propose backend/frontend structure, API boundaries, authentication/authorization model, database approach, UI direction, and deployment architecture.
- List any decisions I must make before implementation.
- No feature implementation until approved.

### Phase 2 — Safety, Baseline, and Development Setup
- Propose a safe backup/version-control workflow and a reproducible local development setup.
- Record the baseline behavior and existing test/build status.
- Review environment configuration, secret handling, debug settings, allowed hosts, and database settings.
- Address security issues only within the approved scope and with a safe migration plan.
- Do not reset or alter production data.

### Phase 3 — Backend Foundation and Data Model
- Configure/verify Django, DRF, PostgreSQL connection strategy, environment variables, models, migrations, permissions, validation, and API error conventions.
- Explain any data migration or compatibility impact before changes.
- Run approved checks and tests.

### Phase 4 — Authentication and Authorization
- Implement or improve candidate/HR/admin authentication only as defined in the approved scope.
- Use Django’s secure password hashing and appropriate permissions.
- Explain account migration, session/token approach, and security implications before implementation.
- Never expose real credentials.

### Phase 5 — Core Job Portal APIs and Business Logic
- Implement approved job listing, search/filtering, job details, HR job management, candidate applications, and related endpoints.
- Document request/response examples and validation rules.
- Test permissions, invalid inputs, and expected error cases.

### Phase 6 — React + Vite Frontend Foundation and Design System
- Propose routes, page structure, reusable components, responsive layout, typography, spacing, colors, and interaction patterns.
- Present a concise UI plan or mockup/reference description for approval before building a major set of screens.
- Keep the visual design professional and natural; avoid unnecessary visual effects or generic template-like UI.
- Implement only the approved design and pages.

### Phase 7 — Frontend Feature Integration
- Connect approved React screens to the APIs.
- Implement loading, empty, success, validation, authorization, and error states.
- Verify form behavior, navigation, responsive layouts, and API error handling.

### Phase 8 — Approved Optional Features
- Review each optional PRD/SRS feature separately (for example candidate profiles, resume uploads, application tracking, saved jobs, or notifications).
- Explain business value, added complexity, data/privacy implications, dependencies, and testing.
- Implement only the optional features I explicitly approve.

### Phase 9 — Quality Assurance and Security Review
- Run available backend tests, frontend tests/build/lint checks, API checks, and manual end-to-end scenarios.
- Review authentication, authorization, input validation, file upload security, secret handling, error messages, and common Django/React risks.
- Report any test that could not be run and why.
- Do not claim the system is production-ready solely because it builds successfully.

### Phase 10 — Hosting Compatibility and Deployment Plan
- First inspect the client’s existing hosting plan and deployment constraints; ask me to provide the provider/plan details if needed.
- Confirm support for Python/Django, PostgreSQL, static frontend hosting, environment variables, HTTPS, background jobs (if needed), and backups.
- Prepare a deployment plan, rollback plan, required environment variables, migration steps, DNS/SSL steps, and expected downtime.
- Do not deploy, change DNS, or purchase/upgrade hosting without my explicit approval.
- Keep domain, hosting, email, and third-party service fees separate from development scope.

### Phase 11 — Release, Handover, and Documentation
- Only after approval, deploy using the approved plan.
- Verify the deployed site and critical user journeys.
- Provide setup instructions, environment-variable checklist, API documentation, backup/restore notes, known limitations, and handover summary.
- Confirm ownership and access handover without putting secrets into documentation.

---

## 5. Mandatory Phase Proposal Template

Before starting **every** phase, present this template and wait for approval:

```text
PHASE PROPOSAL — Phase [number]: [name]

1. Goal
What this phase will achieve and why it is needed.

2. Current findings
What I verified in the repository/PRD/SRS. Clearly label anything not tested.

3. Exact planned work
Numbered steps describing what I will do and how I will do it.

4. Expected file changes
Files/modules likely to be created, edited, moved, or deleted. If unknown, say that inspection is needed.

5. What I need from you
Questions, decisions, sample content, UI preferences, hosting details, or access required.
Never request passwords/secrets in chat.

6. Risks and safeguards
Potential breakage, data/security implications, backup/rollback plan, and how existing functionality will be protected.

7. Tests and acceptance criteria
Exact checks to run and measurable conditions that mean this phase is complete.

8. Dependencies and cost implications
New packages/services, external integrations, hosting requirements, recurring costs, and alternatives.

9. Estimated effort
Rough estimate with assumptions; explain uncertainty.

10. Out of scope
What will not be done in this phase.

11. Approval request
“Do you approve Phase [number] as described? I will not start implementation until you explicitly approve.”
```

Do not start implementation if important questions remain unanswered or the phase proposal is incomplete.

---

## 6. Mandatory Completion Report

After an approved phase is implemented, provide:

1. **Summary:** What was completed.
2. **Files changed:** Each important file and the reason for the change.
3. **Commands/actions:** Commands run and any dependency changes.
4. **Tests:** Exact tests/checks run and actual results (pass/fail/not run).
5. **Manual verification:** What was actually opened or tested.
6. **Known issues:** Anything incomplete, uncertain, or deferred.
7. **My required actions:** Any setup, configuration, or decision I must make.
8. **Data/security/deployment impact:** State clearly if none, or explain it.
9. **Acceptance checklist:** Mark each criterion pass/fail/not verified.
10. **Next phase proposal:** Present the next phase separately and wait for approval.

Do not move on automatically after this report.

---

## 7. Start Here — First Message to Antigravity

Start with **Phase 0 only**.

1. Confirm that you can access the extracted project folder and both PRD/SRS files.
2. If files are missing, stop and tell me exactly which files/folder I need to provide.
3. Inspect the repository in read-only mode. Do not edit files, install dependencies, run migrations, change settings, or deploy anything during this initial review.
4. Present:
   - A concise repository and architecture summary.
   - Existing pages/features and what is only inferred from code.
   - Framework/dependency versions where discoverable.
   - Existing tests and whether they have actually been run.
   - Security/configuration concerns, with file paths and evidence.
   - Questions or decisions needed from me.
   - A proposed phase roadmap mapped to PRD/SRS.
   - Hosting information I need to confirm.
5. Use the Mandatory Phase Proposal Template for Phase 0 and ask for approval before any work that changes files or environment.

**Remember: Analyze first. Explain clearly. Ask. Wait for approval. Then implement only the approved phase.**
