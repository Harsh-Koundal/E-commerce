# Contributing to PRINTZET LABS

Thank you for considering contributing to this project! We welcome contributions from everyone in the team. Please follow the guidelines below to keep the codebase clean, consistent, and scalable.

---

##  Repository Structure & Branch Strategy

We follow a strict Git branching model:

- **`main`** — stable production-ready code
- **`dev`** — integration branch for development
- **`feature/*`** — feature development branches
- **`bugfix/*`** — bug fixes
- **`hotfix/*`** — urgent production-level fixes
- **`release/*`** — pre-release preparation

**Naming convention**: use kebab-case for branch names  
Examples:
- `feature/login-page`
- `bugfix/user-authentication-error`
- `hotfix/api-crash-on-null-input`

---

##  Pull Request Process

1. **Create a branch** from `dev` or `main` depending on the context.
2. Write or update code, including tests and docs.
3. **Commit messages** must follow the Conventional Commits format (see below).
4. Push to your branch and open a **Pull Request** to `dev`.
5. Request a review from a relevant team member. 
6. Ensure your PR includes:
   - Description of the change
   - Screenshots (if UI-related)
   - Issue reference (if applicable)

---

##  Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. Format:

<type>(scope): <short summary>

[optional body]

[optional footer(s)]




### Allowed types:
- `feat`: a new feature
- `fix`: a bug fix
- `docs`: documentation only changes
- `style`: formatting, missing semi-colons, etc.
- `refactor`: code change that neither fixes a bug nor adds a feature
- `test`: adding or fixing tests
- `chore`: non-production code changes (CI, configs, etc.)

### Examples:
feat(login): add Google sign-in button
fix(api): handle null value in user profile
docs(readme): update installation steps


---

##  Code Standards & Best Practices

- Follow [PEP8 / ESLint / Prettier / Pylint] as applicable
- Document all functions and classes
- Avoid large PRs — break into smaller chunks
- Write or update unit/integration tests
- Avoid leaving commented-out code


---

##  Reporting Issues / Requesting Features

Please use GitHub **Issues** with the appropriate labels:

- `bug`: for bugs and regressions
- `enhancement`: for feature requests
- `question`: for clarification/discussion

### Issue Template (Example):
```

Description
A clear and concise description of the bug or feature.

Steps to Reproduce

Go to '...'

Click on '....'

See error

Expected behavior
...

Screenshots
...

Environment

OS: [e.g. Windows 10]

Browser [e.g. Chrome 100]

Version [e.g. v1.2.3]
```

---

##  Code Reviews

All PRs must be reviewed before merging.

- Use **GitHub review tools** to comment, approve, or request changes.
- Ensure PR meets coding guidelines and does not break existing functionality.
- Run and pass all automated tests before approval.

---

##  Tools Used (Setup Guides in `/docs/`)

- **Linting**: ESLint / Pylint / Black
- **Testing**: Jest / Pytest
- **Formatting**: Prettier / Black
- **CI/CD**: GitHub Actions / GitLab CI
- **Docs**: MkDocs / Sphinx

---

##  Code of Conduct

By contributing, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

##  Thanks!

Happy Coding!   
Team [PRINCE PAL](www.github.com/theprince29)


