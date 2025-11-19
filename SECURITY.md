# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to teamhfive25@gmail.com. All security vulnerabilities will be promptly addressed.

**Please do not create public GitHub issues for security vulnerabilities.**

### What to Include

When reporting a vulnerability, please include:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 5 business days
- **Fix Timeline:** Varies based on severity and complexity

## Security Best Practices

### Environment Variables

- **Never commit** `.env` files to version control
- Use `.env.example` as a template
- Rotate API keys regularly
- Use different keys for development and production

### API Keys

- Store all API keys in environment variables
- Use least-privilege access principles
- Implement rate limiting on API endpoints
- Monitor API usage for anomalies

### Database Security

- Use Row Level Security (RLS) in Supabase
- Validate all user inputs
- Use parameterized queries
- Regularly backup your database

### Application Security

- Keep dependencies up to date
- Run `npm audit` regularly
- Use HTTPS in production
- Implement proper authentication and authorization
- Sanitize user inputs
- Implement CSRF protection

## Acknowledgments

We appreciate the security research community's efforts in responsibly disclosing vulnerabilities.
