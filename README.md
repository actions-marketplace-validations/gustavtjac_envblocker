# Dotenv Blocker 🚫

A lightweight GitHub Action that **fails pull requests if `.env` files are included**.

This helps prevent accidental commits of environment files and secrets before they are merged into protected branches.

---

## ⚠️ Important limitation

This action **does not prevent secrets from entering git history**.

GitHub Actions run *after* commits are pushed.  
Dotenv Blocker is designed to **detect and block `.env` files in pull requests**, so mistakes are caught early and do not reach `main` or deployment pipelines.

---

## ✅ What it does

- Fails PRs that include:
  - `.env`
  - `.env.*`
  - `*.env`
- Clearly lists offending files in the CI output
- Requires **zero configuration**
- Runs fast (filename-based check only)

---

## ❌ What it does not do

- Scan file contents for secrets
- Rewrite git history
- Replace pre-commit hooks or secret scanners

For best protection, use this action **together with**:
- `.gitignore`
- Pre-commit hooks
- GitHub Secrets
- Secret scanning tools

---

## 🚀 Usage

Add the following workflow to your repository:

```yaml
name: Dotenv Blocker

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  dotenv-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gustavtjac/dotenv-blocker@v1
