CHAKAN JOB PORTAL
# Software Requirements Specification
Functional, non-functional, technical, security, and deployment requirements
Document ID: CHJ-SRS-001  |  Version: 1.0  |  Date: 26 October 2026

## 1. Introduction

### 1.1 Purpose
This SRS specifies the proposed requirements for rebuilding/improving the Chakan Job Portal with a React frontend and a Python/Django backend. It is intended for the client, developer, tester and deployment team.

### 1.2 Scope
The system will provide public job discovery and applications, secure recruiter account access, job management, applicant management, and an administration capability. The final scope is subject to client approval.

### 1.3 Terms

## 2. Overall System Description

### 2.1 Proposed Architecture
- Frontend: React single-page web application, responsive and accessible.
- Backend: Python with Django; Django REST Framework is recommended for JSON REST APIs.
- Database: PostgreSQL for production.
- Authentication: Django authentication with secure password hashing and a clearly defined session or token strategy.
- File storage: private or access-controlled storage for resumes, if resume upload is approved.
- Hosting: production environment supporting Django/Python and PostgreSQL; React static build can be hosted on the same platform or separately.
- Domain and HTTPS: domain DNS configured to the frontend/backend as required, with valid TLS certificates.
- Version control and deployment: Git repository, environment-specific settings and documented release process.

### 2.2 User Classes

## 3. Functional Requirements
Requirements marked optional are not part of the committed MVP until the client approves them.

## 4. Data Requirements
Data fields must be confirmed with the client. Collect only information required for the agreed workflow. Avoid placeholder defaults for required personal fields; enforce validation and appropriate database constraints.

## 5. API Requirements
Suggested API groups (final endpoint paths and payloads will be documented during implementation):
All write operations must validate inputs on the server. API responses should use consistent status codes and a predictable JSON error format. Exact authentication mode (secure session cookies or token-based auth) must be chosen before implementation.

## 6. Non-Functional Requirements

## 7. Security Requirements and Existing Audit Flags
- The supplied project settings show DEBUG enabled and ALLOWED_HOSTS empty; production settings must be explicitly configured before release.
- Database credentials are present directly in the supplied settings file; move secrets to environment variables and rotate any credentials that may have been shared.
- The supplied HR model includes a password field in the application model. Replace this pattern with Django's built-in authentication/user model or an appropriately configured custom user model and password hashing.
- Review every HR view for authentication, object-level authorization and CSRF protections; a recruiter must not access another recruiter's posts or applications.
- Validate uploaded files, user inputs, salary ranges and application/job ownership on the server.
- Use HTTPS, secure session/cookie settings, restricted CORS if frontend and backend are on separate origins, and safe production error pages.
- Do not commit secrets, production database dumps, private resumes or real user data to the source repository.

## 8. Hosting, Domain and Deployment Requirements
- Choose a hosting provider/plan that supports the selected Python version, Django application server, PostgreSQL and required storage. Confirm provider compatibility before purchase.
- Decide whether React and Django will be deployed on one host or separately. If separate, configure API base URL, CORS and secure authentication appropriately.
- Register or transfer the domain under the client's ownership and configure DNS records for the selected deployment.
- Enable HTTPS/TLS for the website and API; redirect HTTP to HTTPS.
- Configure environment variables for Django secret key, database URL/credentials, allowed hosts, email provider and other integrations.
- Run production migrations, collect static files, configure the application server and reverse proxy as required by the host.
- Set up database backups, basic uptime/error monitoring and a documented restore procedure.
- Prepare a staging/test environment if budget and hosting permit; verify production deployment using a release checklist.
- Provide a handover document covering source repository, environment configuration names (not secret values), admin access handover, backups and renewal dates.
Cost note: domain registration/renewal, hosting, managed database, storage, email/SMS services and optional maintenance are recurring costs. The client should approve these costs separately from one-time development charges.

## 9. Testing and Acceptance Criteria
- A visitor can browse job listings, open a job and search/filter by the supported fields.
- A candidate can submit a valid application; invalid input is rejected with clear messages and no incomplete record is saved.
- A recruiter can register/sign in and create a valid job post.
- A recruiter can manage their own posts but cannot view, modify or delete another recruiter's posts or applicants.
- Only authorised users can access protected dashboard/API routes.
- Password storage uses secure hashing and production settings do not expose debug output or credentials.
- React and API workflows work at agreed mobile, tablet and desktop widths.
- The production domain resolves, HTTPS is valid, database writes persist, and static/media assets load correctly.
- Critical and high-severity bugs found during agreed testing are fixed before acceptance.

## 10. Risks and Dependencies
- The existing project may contain data or workflows that need migration; the current database contents and source of truth must be confirmed.
- The hosting provider may not support Django or PostgreSQL; compatibility must be checked before purchase.
- Optional features such as email, SMS, push notifications or resume storage may require third-party accounts and additional recurring costs.
- The client must approve the design, required fields, application process, privacy/retention rules and final feature scope.
- Any significant scope change may affect schedule and price and should be approved in writing.

## 11. Deliverables
- Approved requirements and screen/workflow plan.
- React frontend source code.
- Django backend/API source code.
- Database models and migration files.
- Configuration example file without real secrets.
- Test checklist and test results.
- Production deployment, domain DNS and HTTPS configuration as agreed.
- Basic setup, deployment and handover documentation.

## 12. Items Requiring Client Confirmation
- Final feature list and priority (MVP versus optional features).
- Whether candidate accounts are required or public applications are sufficient.
- Application statuses and who can change them.
- Resume upload rules and privacy/data retention requirements.
- Job moderation, expiry and closing rules.
- Preferred language(s), brand assets, logo, colours and content.
- Domain ownership/registrar, hosting provider, expected traffic and budget.
- Email/notification requirements and any third-party services.
- Maintenance period, response expectations and future support.

## 13. Change Control
This SRS is a baseline proposal. The client and developer should approve it before implementation. Any requirement added or changed after approval should be recorded, estimated and approved before work begins.

| Term | Meaning |
| --- | --- |
| Candidate | A person searching for or applying to a job. |
| Recruiter / HR | An employer representative who manages job posts and applicants. |
| Admin | A privileged operator responsible for system administration. |
| API | An interface through which React communicates with Django. |
| MVP | Minimum Viable Product: the first agreed, usable release. |


| Role | Permissions |
| --- | --- |
| Anonymous visitor | View and search public jobs; submit an application if enabled by the approved flow. |
| Candidate account (optional MVP extension) | Manage own profile, resume, saved jobs and own application history. |
| Recruiter / HR | Manage own account and job posts; view applications only for their own posts. |
| Administrator | Manage users/posts and support system operations according to an explicit admin policy. |


| ID | Requirement | Description |
| --- | --- | --- |
| FR-01 | Public job listing | The system shall display published job posts with key information such as title, company, location, salary and job type. |
| FR-02 | Job details | The system shall show the complete available details for a selected job post. |
| FR-03 | Job search | The system shall allow users to search by keyword and filter by supported fields including area/location, job type, salary, education, experience and shift. |
| FR-04 | Search results | The system shall show a useful empty state when no jobs match and shall paginate large result sets. |
| FR-05 | Candidate application | The system shall accept an application for an open job and validate required fields on the server. |
| FR-06 | Application confirmation | The system shall show a success confirmation only after the application is saved successfully. |
| FR-07 | Recruiter registration | The system shall allow a recruiter to register using the approved fields and validate unique account identifiers. |
| FR-08 | Recruiter login/logout | The system shall authenticate recruiters securely and allow them to end their session. |
| FR-09 | Job creation | An authenticated recruiter shall be able to create a job post with validated job, salary, requirements and company details. |
| FR-10 | Job management | A recruiter shall be able to view, edit, close or delete only posts they are authorised to manage. |
| FR-11 | Applicant management | A recruiter shall be able to view applications linked to their own job posts. |
| FR-12 | Admin management | An authorised administrator shall be able to manage users and job posts through a controlled admin interface. |
| FR-13 | Candidate profile (optional) | If approved, a candidate shall be able to create and update their profile. |
| FR-14 | Resume upload (optional) | If approved, the system shall accept only configured file types and size limits and store files securely. |
| FR-15 | Application status (optional) | If approved, authorised recruiters shall update an application status and candidates shall see their own status. |
| FR-16 | Saved jobs (optional) | If approved, signed-in candidates shall be able to save and remove jobs from a personal list. |
| FR-17 | Notifications (optional) | If approved, the system shall send configured notifications using an agreed email/SMS/push provider. |
| FR-18 | Audit and error handling | The system shall record appropriate application errors and security-relevant events without logging passwords or secrets. |


| Entity | Key data (proposed) |
| --- | --- |
| User / Recruiter | ID, full name, email, phone, password hash/auth identity, company, role, created/updated timestamps, active status. |
| Job Post | ID, recruiter ID, title, description, openings, salary range, shift, job type, education, experience, contact/application method, company details, area/location, status, created/updated/closing dates. |
| Application | ID, job ID, candidate details, qualification, contact information, address if needed, resume reference if enabled, status if enabled, submitted timestamp. |
| Candidate Profile (optional) | User ID, contact details, education, experience, skills and resume reference as approved. |
| Saved Job (optional) | Candidate ID, job ID, created timestamp; candidate/job pair should be unique. |
| Audit Event | Event ID, actor ID where available, action, target type/ID, timestamp and safe metadata. |


| API group | Purpose |
| --- | --- |
| GET /api/jobs/ | List/search/filter published jobs with pagination. |
| GET /api/jobs/{id}/ | Retrieve job details. |
| POST /api/jobs/{id}/applications/ | Submit an application for an open job. |
| POST /api/auth/register/ | Register a recruiter or approved account type. |
| POST /api/auth/login/ and logout/ | Authenticate and terminate an authenticated session/token. |
| GET/POST /api/hr/jobs/ | List a recruiter's jobs or create a new job. |
| GET/PATCH/DELETE /api/hr/jobs/{id}/ | View, update or delete an authorised job post. |
| GET /api/hr/jobs/{id}/applications/ | List applicants for a job owned by the recruiter. |
| GET/PATCH /api/hr/applications/{id}/ | View or update an application where permitted; status updates only if approved. |


| ID | Requirement | Description |
| --- | --- | --- |
| NFR-01 Performance | Common pages and API requests should respond promptly under the agreed expected load. Establish measurable targets after hosting and traffic are known. |  |
| NFR-02 Responsive design | Core workflows shall be usable on mobile, tablet and desktop screen sizes. |  |
| NFR-03 Security | Use Django password hashing, least-privilege permissions, CSRF protection where applicable, secure cookies, input validation, rate limiting for sensitive endpoints and production security settings. |  |
| NFR-04 Privacy | Collect only necessary personal data; restrict applicant information to authorised users; define retention and deletion rules with the client. |  |
| NFR-05 Reliability | Handle validation failures and unexpected errors without exposing stack traces or secrets to end users. |  |
| NFR-06 Maintainability | Use separate React components, Django apps/services, documented configuration and version control. |  |
| NFR-07 Accessibility | Forms and key actions should support keyboard navigation, labels, readable contrast and meaningful error messages. |  |
| NFR-08 Compatibility | Support current stable versions of major browsers, subject to agreed test coverage. |  |
| NFR-09 Backup/recovery | Configure database backups and define retention/recovery expectations based on the selected hosting plan. |  |
| NFR-10 Observability | Capture server errors and uptime/health signals without storing sensitive data in logs. |  |
