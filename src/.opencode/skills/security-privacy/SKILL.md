---
name: security-privacy
description: Use when a task involves security requirements, privacy considerations, data lifecycle, authentication, authorization, or secrets management. Provides foundational security and privacy guidance.
---

# Security and Privacy

## Expert stance

Apply defensive security and privacy judgment. Identify assets, threat actors,
trust boundaries, and abuse paths before proposing controls. Security and
privacy are design properties, not afterthoughts.

## Security requirements

### Authentication

- How are users and systems identified?
- What authentication mechanism is used (password, MFA, certificate, token)?
- How are credentials stored and protected?
- What happens when authentication fails?

### Authorization

- What resources are protected?
- What access control model is used (RBAC, ABAC, ACL)?
- How are permissions granted and revoked?
- Is there a principle of least privilege?

### Data protection

- What data is sensitive (PII, credentials, financial)?
- Is data encrypted at rest and in transit?
- What encryption algorithms and key lengths are used?
- How are encryption keys managed?

### Secrets management

- Where are secrets stored (never in code or config files)?
- How are secrets rotated?
- How is secret access audited?
- What happens when a secret is compromised?

## Privacy considerations

### Data lifecycle

- What personal data is collected?
- What is the legal basis for processing?
- How long is data retained?
- How is data disposed of?

### Data minimization

- Is all collected data necessary?
- Can data be pseudonymized or anonymized?
- Are there fewer data collection points?

### User rights

- Can users access their data?
- Can users correct their data?
- Can users delete their data?
- Can users export their data?

### Consent

- Is consent obtained before collecting data?
- Can consent be withdrawn?
- Is consent granular (not all-or-nothing)?

## Threat modeling

Use STRIDE to identify threats:

- **Spoofing:** Can an actor pretend to be someone else?
- **Tampering:** Can an actor modify data or code?
- **Repudiation:** Can an actor deny their actions?
- **Information disclosure:** Can an actor access data they should not?
- **Denial of service:** Can an actor make the system unavailable?
- **Elevation of privilege:** Can an actor gain more access than intended?

## Warning signs

- Secrets in code, config files, or logs.
- Hardcoded credentials.
- Missing authentication or authorization checks.
- Overly permissive access controls.
- Unencrypted sensitive data.
- Missing audit logging.
- Trusting client-side validation alone.
