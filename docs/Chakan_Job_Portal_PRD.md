CHAKAN JOB PORTAL
# Product Requirements Document
Scope, users, features, outcomes, and delivery plan
Document ID: CHJ-PRD-001  |  Version: 1.0  |  Date: 26 October 2026

## 1. Purpose
This document defines the proposed product scope for improving the existing Chakan Job Portal. It is based on a preliminary review of the supplied Django project files. The final scope must be confirmed with the client before implementation.

## 2. Product Vision
Build a reliable, professional and mobile-friendly job portal that connects job seekers with employers and recruiters, with a focus on job opportunities in the Chakan industrial area.

## 3. Current Project Snapshot
- The supplied project is a Django/Python web application with separate HR and job-related apps.
- Existing templates indicate job listing, job detail, job search, candidate application, HR signup/login, job posting, and applicant-related pages.
- The project requirements file includes Django and PostgreSQL support.
- The supplied settings require a security and deployment review before production use. In particular, debug/deployment settings, database credentials, and HR password handling need attention.
- The project has not yet been fully executed and tested as part of this document; listed issues are audit items, not claims that every workflow is currently broken.

## 4. Business Goals
- Make it easier for candidates to find relevant jobs and submit applications.
- Help HR/recruiters create and manage job posts and review applicants.
- Improve trust through a clear interface, consistent information and safer account handling.
- Make the application maintainable so future features can be added without unnecessary rework.
- Deploy the production website using a domain name, hosting, HTTPS and a production database.

## 5. Target Users

## 6. Proposed Product Scope

### 6.1 Core features (MVP)
- Public homepage with job listings and clear navigation.
- Job detail page showing title, company, location, salary range, openings, shift, education, experience and application instructions where available.
- Job search with filters for location/area, job title, job type, salary range, education, experience and shift, subject to data availability.
- Candidate application form with required-field validation and confirmation after submission.
- HR registration/login with secure authentication.
- HR dashboard to create, view, edit, close and delete authorised job posts.
- Applicant list for each job post, visible only to the authorised recruiter/administrator.
- Responsive layouts for mobile, tablet and desktop.
- Basic admin tools, error messages, empty states and success states.
- Production deployment, domain configuration, HTTPS and database setup.

### 6.2 Proposed enhancements (confirm with client)
- Candidate accounts and profile editing.
- Resume/CV upload and download with file type/size restrictions.
- Candidate application history and application status tracking.
- Saved jobs and email notifications.
- Recruiter analytics (active jobs, total applications, recent applicants).
- Job expiry dates, vacancy closing and optional job approval before publication.
- Search sorting, pagination and SEO improvements.
These enhancements are proposals, not confirmed client requirements. They should be included only after the client approves their scope, timeline and cost.

## 7. UX and Design Requirements
- Create a consistent visual system for colours, typography, spacing, buttons, form fields, cards and alerts.
- Use clear labels and simple forms with inline validation messages.
- Keep key actions easy to find: Search Jobs, View Details, Apply, Post a Job and Manage Applicants.
- Design for small screens first and verify common desktop widths.
- Include loading, empty, error and success states where relevant.
- Avoid unnecessary animation and ensure readable contrast and keyboard accessibility for essential flows.

## 8. Success Measures

## 9. Out of Scope Unless Approved
- Native Android/iOS applications.
- Paid job listings, online payments or subscription billing.
- Third-party background checks or identity verification.
- Automated WhatsApp/SMS services that require paid provider accounts.
- Complex AI-based candidate matching.
- Bulk migration or cleanup of old data beyond the agreed migration plan.

## 10. Delivery Phases

## 11. Hosting, Domain and Operating Costs
- A hosting plan must support a Python/Django application and PostgreSQL, or the backend and database may need separate services.
- React can be built and served as static files through a compatible host, or served from a separate frontend hosting service.
- Domain registration/renewal, hosting, database/storage, email/SMS and backup costs should be listed separately from development charges.
- The client should own the domain, hosting account, billing details and recovery email. The developer can be granted limited access for setup.
- Confirm expected traffic, storage, email needs, backup retention and support period before choosing the hosting plan.

## 12. Assumptions and Open Questions
- Confirm whether existing candidate applications and HR accounts must be migrated from the supplied SQLite file or another database.
- Confirm whether candidate registration/login is required, or whether applications remain public forms.
- Confirm required application statuses (for example: Submitted, Reviewing, Shortlisted, Rejected, Hired).
- Confirm resume file types, maximum size and retention rules if uploads are approved.
- Confirm whether job posts need admin approval before they become public.
- Confirm the hosting provider, domain registrar, expected traffic, email provider and support expectations.
- Confirm the language(s) required for the user interface.

## 13. Approval
The client should approve the MVP scope, optional features, budget, schedule, hosting plan and acceptance criteria before development begins. Any additional features requested later should be handled as a scope change.

| User type | Needs |
| --- | --- |
| Job seeker / candidate | Browse and search jobs, review job details, apply, and receive clear submission feedback. |
| HR / recruiter | Create an account, sign in securely, publish/manage job posts, and review applications for their own posts. |
| Administrator | Manage access and support the portal, review records, and maintain the service. |


| Area | Proposed acceptance measure |
| --- | --- |
| Core workflow | A recruiter can create a job and view applications; a candidate can search and submit an application. |
| Responsive UI | Main pages usable at mobile, tablet and desktop breakpoints. |
| Security | No plain-text passwords; access checks prevent one recruiter from managing another recruiter's posts/applications. |
| Reliability | No known critical defects in agreed acceptance tests. |
| Deployment | Production domain resolves correctly, HTTPS works, and production database/static files are configured. |
| Usability | Forms show clear validation and success/error feedback. |


| Phase | Activities | Output |
| --- | --- | --- |
| 1. Discovery & audit | Run the project, map current workflows, confirm client needs, review data and hosting. | Approved scope and issue list |
| 2. Architecture & UI | Define React screens, API contract, design system and database changes. | Screen designs and technical plan |
| 3. Backend | Secure authentication, REST APIs, models, validation, permissions and search. | Tested Django API |
| 4. Frontend | Build React pages, forms, dashboards, filters and responsive states. | Working React application |
| 5. Integration & QA | Connect frontend/API, test workflows, security and responsive layouts. | Test report and fixed defects |
| 6. Deployment | Configure server, PostgreSQL, environment variables, domain, HTTPS, backups and monitoring. | Production release and handover |
