# CI/CD Integration Guide for Playwright

**Document Version:** 1.0  
**Last Updated:** December 13, 2025  
**Author:** Manus AI

---

## 1. Overview

Integrating your Playwright test suite into a Continuous Integration/Continuous Deployment (CI/CD) pipeline is essential for maintaining software quality. This guide provides a step-by-step walkthrough for setting up a CI/CD workflow using GitHub Actions.

The provided workflow automates the process of running your tests on every push and pull request, ensuring that new changes do not introduce regressions and that the application remains stable.

---

## 2. GitHub Actions Workflow

Below is a detailed explanation of the `playwright.yml` workflow file located in this directory. This file defines the CI/CD pipeline for your test suite.

### 2.1. Workflow Triggers

The workflow is configured to run on the following events:

- **`on: push`**: Runs when code is pushed to the `main` or `develop` branches.
- **`on: pull_request`**: Runs when a pull request is opened or updated for the `main` or `develop` branches.

This ensures that tests are run both before and after code is merged, providing a comprehensive safety net.

### 2.2. Job Configuration

The workflow consists of a single job named `test` that runs on an `ubuntu-latest` runner.

### 2.3. Workflow Steps

**Step 1: Checkout Code**
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
This step checks out your repository code so the workflow can access it.

**Step 2: Set up Node.js**
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
```
This step installs the specified version of Node.js.

**Step 3: Install pnpm**
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10
```
This step installs `pnpm`, the package manager used by this project.

**Step 4: Install Dependencies**
```yaml
- name: Install dependencies
  run: pnpm install
```
This step installs all project dependencies, including Playwright.

**Step 5: Install Playwright Browsers**
```yaml
- name: Install Playwright browsers
  run: pnpm run install:browsers
```
This step downloads the browser binaries (Chromium, Firefox, WebKit) required by Playwright.

**Step 6: Run Playwright Tests**
```yaml
- name: Run Playwright tests
  run: pnpm test:ci
```
This is the core step of the workflow. It executes all Playwright tests using the `test:ci` script, which is configured to use the appropriate reporters for a CI environment.

**Step 7: Upload Test Reports**
```yaml
- name: Upload test reports
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: reports/html/
    retention-days: 30
```
This step uploads the generated HTML test report as a build artifact. The `if: always()` condition ensures that the report is uploaded even if the tests fail, allowing you to debug the failures.

---

## 3. Setting Up the Workflow

1.  **Create the workflow file:**
    - Ensure the `playwright.yml` file (provided in this directory) is present in your repository at `.github/workflows/playwright.yml`.

2.  **Add Environment Variables as Secrets:**
    - In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
    - Create a new repository secret for each sensitive variable in your `.env` file (e.g., `TEST_CLIENT_PASSWORD`, `STRIPE_TEST_SECRET_KEY`).
    - **Do not** commit your `.env` file to the repository. The CI workflow will use the secrets you define here.

3.  **Update the Workflow (if needed):**
    - If your application requires a running backend for the tests, you will need to add steps to start your application server before running the tests. This can be done by adding a `run` step that starts your server in the background:
      ```yaml
      - name: Start application server
        run: pnpm start:server &
      ```

---

## 4. Viewing Test Results

After the workflow runs, you can view the test results directly in GitHub:

1.  Go to the **Actions** tab in your repository.
2.  Click on the workflow run you want to inspect.
3.  In the job summary, you will see an **Artifacts** section with the `playwright-report`.
4.  Download the artifact, unzip it, and open the `index.html` file in your browser to view the detailed test report.

---

## 5. Best Practices for CI/CD with Playwright

- **Run Tests in Parallel:** The `playwright.config.ts` is configured to run tests in parallel (`fullyParallel: true`). For CI, you may want to adjust the number of `workers` to optimize performance based on the resources of your CI runner.

- **Use Retries:** The configuration enables retries in a CI environment (`retries: process.env.CI ? 2 : 0`). This can help mitigate flaky tests that might fail due to intermittent network issues.

- **Separate Test Suites:** Use the different test scripts (`test:unit`, `test:regression`, etc.) to run different subsets of tests at different stages of your pipeline. For example, you might run unit and integration tests on every push, but run the full E2E suite only on pull requests to `main`.

- **Cache Dependencies:** To speed up your workflow runs, you can cache the `pnpm` store and Playwright browser binaries. You can add the following steps to your workflow:

  ```yaml
  - name: Get pnpm store directory
    shell: bash
    run: |
      echo "STORE_PATH=$(pnpm store path --silent)" >> "$GITHUB_ENV"

  - uses: actions/cache@v4
    name: Setup pnpm cache
    with:
      path: ${{ env.STORE_PATH }}
      key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-store-

  - name: Cache Playwright browsers
    uses: actions/cache@v4
    with:
      path: ~/.cache/ms-playwright
      key: ${{ runner.os }}-playwright-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-playwright-
  ```

- **Monitor Performance:** Use the performance tests in this framework to track your application's performance over time. You can use the JSON report to extract performance metrics and plot them on a dashboard to identify performance regressions.
