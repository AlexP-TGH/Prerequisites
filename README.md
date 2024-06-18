# E2E testing the flow of ordering the WobHost products

## Author:

- Task completed by Oleksandr Popov, according to the information provided by LvivIT

## Main goal

- The goal of this task is to automate the process of adding a product and an addon to the cart on the cPanel Store
  website ( Portal Home -
  cPanel Store ) using Playwright.

## Bug report

- Link to the document with the bugs found during the test task: https://docs.google.com/spreadsheets/d/1OULdWVR7UJ4u4WIJt437ZN_z-q40jdsFvm5fWnRtvmU/edit?usp=sharing

## Flow to test:

### 1. Navigate to the cPanel store:

- Open Shopping Cart - cPanel Store (ensure you are not logged in).

### 2. Order a Product:

- Click 'Order Now' for any product.

### 3. Enter IP Address:

- On the new page, enter an IP address (e.g., 2.2.2.2 ).

### 4. Select Addons:

- Choose any addon(s).

### 5. Continue to Checkout:

- Verify the 'Order Summary' is updated.
- Click on the 'Continue' button.

### 6. Verify Product and Price:

#### In Step 2 Review & Checkout:

- Verify the expected products and addons are present (names).
- Ensure prices are correct.
- Bonus, not required: Ensure prorated prices are correct.

### 7. Proceed to Checkout:

- Click on the 'Checkout' button.

### 8. Verify Checkout Information:

#### Ensure the information in the product table is correct:

- The license name is correct.
- The IP address is shown.
- The monthly price is correct.
- Bonus: The “Due Today“ prices are correct.
- Verify that the ‘Personal Information', 'Billing Address', 'Account Security', 'Terms & Conditions' and 'Payment
  Details’ sections are visible (filling out the form is not required).
- Verify that the ‘Complete Order' button is visible but disabled.

#### Note: You don’t need to create a new account and complete the checkout process.

## Installation

### Steps to install the project:

1. Cloning the repository

```shell
git clone https://github.com/AsaWor/prerequisites.git
```

2. Move to the directory

```shell
cd prerequisites
```

3. Installing required dependencies

```shell
npm install
```

4. Installing playwright

```shell
npx playwright install
```

# Command Line

## Running all tests

```shell
npx playwright test
```

## Running a single test file

```shell
npx playwright test positive/cart.spec.ts
```

## Run a set of test files

```shell
npx playwright test positive/ negative/
```

## Run files that have to create or edit in the file name

```shell
npx playwright test create edit
```

## Run the test with the title

```shell
npx playwright test -g "Check product's prices"
```

## Running tests in headed mode

```shell
npx playwright test positive/cart.spec.ts --headed
```

## Running tests on a specific project

```shell
npx playwright test positive/cart.spec.ts --project=firefox
```

## Running tests in the debug mode

```shell
npx playwright test --project=firefox --debug
```
