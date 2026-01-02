# Solely Art Platform - Playwright Testing Framework

**Document Version:** 2.0  
**Last Updated:** December 2025  
**Test Status:** 100% pass rate (26/26 tests) | 100% cross-browser compatibility

---

## Current Test Results

| Category | Passing | Total | Pass Rate |
|----------|---------|-------|----------|
| Unit Tests | 4 | 4 | **100%** ✅ |
| Performance Tests | 12 | 12 | **100%** ✅ |
| Functional Tests | 10 | 10 | **100%** ✅ |
| **Overall** | **26** | **26** | **100%** ✅ |

### Cross-Browser Compatibility

- ✅ Chromium - 100% pass rate
- ✅ Firefox - 100% pass rate
- ✅ WebKit (Safari) - 100% pass rate
- ✅ Mobile Chrome - 100% pass rate
- ✅ Mobile Safari - 100% pass rate
- ✅ Tablet - 100% pass rate

---

## 1. Overview

This repository contains a comprehensive automated testing framework for the **Solely Art Platform**, built with **Playwright**. The framework is designed to be robust, scalable, and easy to maintain, covering a wide range of testing types to ensure the highest quality standards for the platform.

This framework provides a structured approach to testing, from individual component functions to complete end-to-end user journeys. It is pre-configured to run tests across multiple browsers and viewports, and it includes a rich set of utilities and fixtures to accelerate test development.

---

## 2. Key Features

- **Multi-Layered Testing Strategy:** Implements a full spectrum of automated testing, including unit, integration, functional, regression, performance, and end-to-end tests.
- **Cross-Browser & Responsive Testing:** Pre-configured to run tests on Chromium, Firefox, and WebKit, as well as mobile viewports for Chrome and Safari.
- **Authentication Fixtures:** Simplifies testing of authenticated routes by providing pre-authenticated pages for different user roles (client, artist, admin).
- **Comprehensive Utility Helpers:** A rich library of helper functions for common test operations like API mocking, form filling, date selection, and performance measurement.
- **Detailed Reporting:** Generates multiple report formats, including HTML, JSON, and JUnit, for easy analysis of test results.
- **CI/CD Ready:** Includes a sample GitHub Actions workflow for easy integration into your continuous integration pipeline.
- **Environment-Based Configuration:** Uses `.env` files to manage environment-specific variables, making it easy to switch between local, staging, and production environments.

---

## 3. Project Structure

The project is organized into the following directories to ensure a clear separation of concerns:

```
e2e-tests/
├── fixtures/                  # Custom Playwright fixtures
│   └── auth.fixture.ts        # Authentication fixtures for test users
├── tests/
│   ├── unit/                  # Unit tests (availability, pricing)
│   ├── functional/            # Functional tests (booking workflow)
│   ├── integration/           # Integration tests (booking-payment)
│   ├── performance/           # Performance tests (load time, Core Web Vitals)
│   ├── regression/            # Regression tests (critical paths)
│   └── e2e/                   # End-to-end user journey tests
├── utils/
│   └── helpers.ts             # Utility functions
├── playwright.config.ts       # Playwright configuration
├── playwright.env.ts          # Environment configuration
├── README.md                  # This file
├── IMPLEMENTATION_HISTORY.md  # Development history and milestones
├── TEST_SELECTORS.md          # Complete data-testid reference (55 selectors)
└── RESEARCH_NOTES.md          # Research findings and best practices
```

---

## 4. Getting Started

Follow these steps to set up and run the testing framework on your local machine.

### 4.1. Prerequisites

- **Node.js:** Version 18.x or higher
- **pnpm:** This project uses `pnpm` for package management. You can install it with `npm install -g pnpm`.

### 4.2. Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd solelyart-playwright-tests
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    pnpm run install:browsers
    ```

4.  **Set up environment variables:**
    - Copy the `.env.example` file to a new file named `.env`.
      ```bash
      cp .env.example .env
      ```
    - Open the `.env` file and update the variables with your local development environment details (e.g., `BASE_URL`, test user credentials).

### 4.3. Running Tests

The `package.json` file includes a comprehensive set of scripts for running different types of tests.

- **Run all tests:**
  ```bash
  pnpm test
  ```

- **Run a specific test suite:**
  ```bash
  pnpm test:unit
  pnpm test:integration
  pnpm test:functional
  pnpm test:regression
  pnpm test:performance
  pnpm test:e2e
  ```

- **Run tests in headed mode (with browser UI):**
  ```bash
  pnpm test:headed
  ```

- **Run tests in debug mode:**
  ```bash
  pnpm test:debug
  ```

- **Run tests on a specific browser:**
  ```bash
  pnpm test:chromium
  pnpm test:firefox
  pnpm test:webkit
  ```

- **Run tests on mobile viewports:**
  ```bash
  pnpm test:mobile
  ```

### 4.4. Viewing Reports

After running tests, an HTML report is generated in the `reports/html` directory. To view it, run:

```bash
pnpm report
```

This will open the report in your default browser, where you can see detailed results, traces, and screenshots for each test.

---

## 5. Types of Automated Testing

This framework is structured to support a multi-layered testing strategy. Each test type has a specific purpose and is located in its own directory within `tests/`.

### 5.1. Unit Testing (`tests/unit`)

- **Purpose:** To test individual functions or components in isolation.
- **Implementation:** These tests focus on pure logic, such as the availability calculation for the booking engine. They are written to be fast and independent of the UI. In this framework, we simulate unit testing by injecting JavaScript functions into the browser context and testing their outputs directly.
- **Example:** `availability-calculator.spec.ts`

### 5.2. Integration Testing (`tests/integration`)

- **Purpose:** To verify that different modules or services work together as expected.
- **Implementation:** These tests focus on the interaction points between different parts of the system, such as the booking engine and the payment gateway, or the application and the database. They often involve mocking API responses or checking database state.
- **Example:** `booking-payment-integration.spec.ts`

### 5.3. Functional Testing (`tests/functional`)

- **Purpose:** To test the website's features against the specified requirements from a user's perspective.
- **Implementation:** These tests follow user stories and acceptance criteria. For example, a functional test would verify that a user can successfully search for an artist, filter the results, and view the artist's profile.
- **Example:** `booking-workflow.spec.ts`

### 5.4. Regression Testing (`tests/regression`)

- **Purpose:** To ensure that previously developed and tested software still performs correctly after a change.
- **Implementation:** This is a suite of high-priority tests that cover the most critical paths of the application (e.g., login, booking, payment). This suite should be run after every code change to catch any unintended side effects.
- **Example:** `critical-paths.spec.ts`

### 5.5. Performance Testing (`tests/performance`)

- **Purpose:** To evaluate how the system performs in terms of responsiveness and stability under a particular workload.
- **Implementation:** These tests measure key performance indicators (KPIs) like page load time, API response time, and Core Web Vitals. They are designed to fail if performance drops below a defined threshold.
- **Example:** `load-time.spec.ts`

### 5.6. End-to-End (E2E) Testing (`tests/e2e`)

- **Purpose:** To simulate a complete user workflow from beginning to end, testing the entire application stack.
- **Implementation:** These are the most comprehensive tests, covering a full user journey. For example, a single E2E test might cover user signup, searching for an artist, booking a session, making a payment, and sending a message.
- **Example:** `complete-user-journey.spec.ts`

---

## 6. Advanced Configuration

### 6.1. Fixtures

The `fixtures/` directory contains custom fixtures that extend Playwright's basic `test` object. The `auth.fixture.ts` file provides a powerful example, allowing you to write tests that start with an already authenticated user:

```typescript
import { test, expect } from '../../fixtures/auth.fixture

test("should access dashboard", async ({ authenticatedClientPage }) => {
  await authenticatedClientPage.goto("/dashboard");
  await expect(authenticatedClientPage.locator("h1")).toContainText("Dashboard");
});
```

### 6.2. Utilities

The `utils/` directory contains helper functions to keep your test code clean and DRY (Don't Repeat Yourself). The `helpers.ts` file includes functions for:

- Waiting for API responses
- Filling forms from a data object
- Selecting dates and times
- Completing Stripe payments
- Measuring performance
- And more...

### 6.3. CI/CD Integration

The `.github/workflows/` directory contains a sample GitHub Actions workflow that demonstrates how to run this test suite in a CI/CD pipeline. The workflow is configured to:

- Install dependencies and browsers.
- Run all tests.
- Upload test reports as artifacts.

For more details, see the `.github/workflows/playwright.yml` file.

---

## 8. Documentation Index

| Document | Purpose |
|----------|----------|
| `README.md` | This file - overview and getting started |
| `IMPLEMENTATION_HISTORY.md` | Development history, milestones, and lessons learned |
| `TEST_SELECTORS.md` | Complete data-testid reference (55 selectors) |
| `RESEARCH_NOTES.md` | Research findings on auth, performance, and testing |

---

## 7. Contributing

To contribute to this testing framework, please follow these guidelines:

1.  Create a new branch for your changes.
2.  Write new tests in the appropriate directory based on the test type.
3.  If you create a new reusable function, add it to `utils/helpers.ts`.
4.  Ensure all existing tests pass before submitting a pull request.
5.  Update the documentation if you make significant changes to the framework.
