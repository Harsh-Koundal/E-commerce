# Copilot Repository Instructions

These are custom repository instructions for GitHub Copilot.  
They define how AI code reviews and suggestions should be applied in **Printzet Labs**.

---

## 🔒 General Rules for Pull Requests

- Every PR must target the `dev` branch (unless it’s a hotfix to `main`).
- PRs must follow the **branch naming convention**:
  - `feature/<name>`
  - `bugfix/<name>`
  - `hotfix/<name>`
  - `release/<name>`
- Reject or flag PRs that:
  - Are opened directly to `main` (unless marked `hotfix/*`).
  - Include very large, unrelated changes.
  - Contain commented-out code blocks or unused imports.

---

## 📜 Commit Message Guidelines

- Must follow **Conventional Commits** format:
<type>(scope): <short summary>
[optional body]

- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Flag commits that do not respect this convention.

---

## 🧑‍💻 Code Standards

- Backend (`printzet-backend`):
- Enforce **Node.js + Express** best practices.
- Require proper error handling with meaningful HTTP status codes.
- All models, controllers, and routes should be modular, documented, and tested.
- Flag direct database queries outside of models.
- Ensure environment variables are not hardcoded.

- Frontend (`prinzet-client`):
- Must follow **React + Vite + TailwindCSS** conventions.
- No inline styles unless absolutely necessary.
- Reusable components should live under `src/components`.
- Flag duplicate or unused imports.
- Ensure ESLint + Prettier rules are respected.

---

##  Testing & Documentation

- All new features must include **unit or integration tests**.
- Reject PRs that decrease test coverage significantly.
- Require updated documentation (`README.md` or relevant docs) for new features.

---

##  Security & Quality Checks

- Flag use of `console.log` or debug statements left in production code.
- Ensure input validation and sanitization exist for backend APIs.
- Reject secrets (API keys, passwords) committed in code.
- Require Dockerfile and `docker-compose.yml` remain consistent with app structure.

---

##  How Copilot Should Behave

When reviewing PRs:
1. **Check branch naming + target branch**.
2. **Verify commit messages follow Conventional Commits**.
3. **Enforce backend and frontend coding standards** as listed above.
4. **Flag security issues** and missing tests/docs.
5. Always give **actionable suggestions** (what to fix and why).

---

✍️ Maintainers: Team Printzet Labs (Prince Pal)


