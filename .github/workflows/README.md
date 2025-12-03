# GitHub Actions CI/CD Setup Guide

## Overview

This project uses GitHub Actions for Continuous Integration (CI) to ensure code quality and prevent broken builds from being merged. The CI workflow runs automatically on every push and pull request.

## Workflow Structure

**File**: `.github/workflows/ci.yml`

### Jobs

1. **Code Quality** (`quality`)
   - Runs ESLint for code style and error detection
   - Performs TypeScript type checking
   - **Purpose**: Catch syntax errors, type issues, and code style violations

2. **Run Tests** (`test`)
   - Executes the full Jest test suite with coverage
   - Uploads coverage reports to Codecov (optional)
   - Posts coverage summary on pull requests
   - **Purpose**: Ensure all functionality works as expected

3. **Build Check** (`build`)
   - Attempts to build the Next.js application
   - Only runs if quality and test jobs pass
   - Verifies the build succeeds with production environment
   - **Purpose**: Ensure the app can be deployed

4. **All Checks Passed** (`all-checks`)
   - Final job that confirms all previous jobs succeeded
   - **Purpose**: Single status check for branch protection rules

### Workflow Triggers

- **Push**: Runs on `main` and `develop` branches
- **Pull Request**: Runs on PRs targeting `main` and `develop`

### Concurrency Control

The workflow cancels in-progress runs on the same branch when a new commit is pushed, saving CI minutes and providing faster feedback.

## Required GitHub Secrets

To run the build job successfully, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below:

### Required Secrets

| Secret Name                          | Description                                           | Example Value                     |
| ------------------------------------ | ----------------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Your Supabase project URL                             | `https://xxxxx.supabase.co`       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Your Supabase anonymous (public) key                  | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (use **test** key for CI) | `pk_test_xxxxx`                   |

### Optional Secret (For Coverage Reporting)

| Secret Name     | Description          | How to Get It                                                              |
| --------------- | -------------------- | -------------------------------------------------------------------------- |
| `CODECOV_TOKEN` | Codecov upload token | Sign up at [codecov.io](https://codecov.io), add your repo, copy the token |

**Note**: The `GITHUB_TOKEN` is automatically provided by GitHub Actions and doesn't need to be configured.

## Setting Up Branch Protection

To enforce that CI must pass before merging:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Set **Branch name pattern** to `main` (or `develop`)
4. Enable:
   - ✅ **Require status checks to pass before merging**
   - Search and select: **All Checks Passed**
   - ✅ **Require branches to be up to date before merging**
5. Optionally enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** (set to 1 for team review)
6. Click **Create**

## Running CI Locally

Before pushing, you can run the same checks locally:

```bash
# Run all checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run test:coverage # Jest with coverage
npm run build         # Next.js build
```

## Understanding CI Results

### ✅ All Checks Passed

- Your code passed all quality gates
- Safe to merge
- Coverage report will be posted on PR

### ❌ CI Failed

Check which job failed:

- **quality**: Fix ESLint or TypeScript errors
- **test**: Fix failing tests or broken functionality
- **build**: Fix build errors, missing environment variables, or import issues

Click on the failed job in GitHub Actions to see detailed error logs.

## CI Performance

- **Average run time**: ~2-3 minutes (with caching)
- **Node.js version**: 20 (LTS)
- **Caching**: npm dependencies are cached between runs

## Coverage Reporting

Coverage reports are automatically generated and:

- Uploaded to Codecov (if token is configured)
- Posted as a comment on pull requests
- Stored as artifacts in GitHub Actions

Current coverage goals:

- **Product browsing feature**: 100%
- **Overall target**: Maintain >80% coverage

## Troubleshooting

### Build Fails Due to Missing Secrets

**Error**: `Environment variable not found: NEXT_PUBLIC_SUPABASE_URL`

**Solution**: Add the required secrets to your GitHub repository (see "Required GitHub Secrets" section above)

### Tests Fail in CI but Pass Locally

**Possible causes**:

- Environment differences (Node version, timezone)
- Missing `.env.local` equivalent in CI
- Race conditions in async tests

**Solution**: Review test logs, ensure tests don't depend on local environment

### Coverage Upload Fails

**Error**: `Codecov upload failed`

**Solution**: This is non-critical (set to `fail_ci_if_error: false`). To fix:

1. Sign up at codecov.io
2. Add `CODECOV_TOKEN` secret
3. Coverage will upload on next run

## Next Steps

Once Tier 1 is working:

- ✅ Add status badge to README
- ✅ Enable branch protection
- Consider Tier 2 features:
  - Dependency security scanning
  - Automated PR comments with build stats
  - Performance budget checks

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Next.js CI/CD Guide](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Codecov Documentation](https://docs.codecov.com/docs)
