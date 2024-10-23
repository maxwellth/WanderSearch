# Wander Search Functionality Automation test.

Hi! 👋 Thanks for reviewing my test automation Test. I've created two different approaches to testing the Wander search functionality to showcase both advanced Cypress patterns and straightforward test writing.

## Project Overview

This project contains two automated test suites for the Wander search feature:

1. **`WanderSearch(main).cy.js`** - Using Cypress Custom Commands
2. **`WanderSearch(Simpler).cy.js`** - Using basic Cypress syntax

### Why Two Different Approaches?

I chose to implement the tests in two different ways to demonstrate both my technical capabilities and my consideration for different audiences who might review or maintain this code.

#### About the Custom Commands Approach (`WanderSearch(main).cy.js`)
I implemented this version using Cypress Custom Commands to showcase how I would structure tests in a production environment. Custom Commands offer several key benefits:

- **Code Reusability**: Common actions can be reused across multiple test files, making it easier to maintain consistent testing patterns
- **Cleaner Test Scripts**: Tests become more readable and less cluttered
- **Easier Maintenance**: When UI elements or workflows change, we only need to update the command definition in one place
- **Better Error Handling**: We can build robust error checking into the commands themselves
- **Domain-Specific Language**: We can create commands that speak the language of Wander's business domain

#### About the Simple Approach (`WanderSearch(Simpler).cy.js`)
This version uses standard Cypress commands without any custom abstractions. I included this version because:
- It's easier to understand for reviewers who might not be familiar with Cypress
- It clearly shows each step of the test execution
- It demonstrates that I understand the fundamental building blocks of Cypress testing

## Project Structure
```
cypress/
├── e2e/
│   ├── WanderSearch(main).cy.js
│   └── WanderSearch(Simpler).cy.js
├── support/
│   ├── commands.js    # Where custom commands live
│   └── e2e.js
└── cypress.config.js
```

## Getting Started

### Installation
1. Clone this repository
```bash
git clone https://github.com/maxwellth/WanderSearch
```

2. Install dependencies
```bash
npm install cypress
```

### Running the Tests
To run all tests in headless mode:
```bash
npm run cypress:run
```

To open Cypress Test Runner:
```bash
npm run cypress:open
```

## Custom Commands
All custom commands are defined in `/cypress/support/commands.js`. Here's a quick example of how the custom commands make the tests more readable:

```javascript
// Without custom commands (from WanderSearch(Simpler).cy.js):
cy.get('[data-testid="search-input"]').type('California');
cy.get('[data-testid="search-button"]').click();
cy.wait('@searchResults');
cy.get('[data-testid="results-list"]').should('be.visible');

// With custom commands (from WanderSearch(main).cy.js):
cy.searchLocation('California');
cy.verifySearchResults();
```

## Test Coverage
Both test suites cover the Similar core functionality:
- Basic search functionality
- Search result validation
- Error handling
- Edge cases (empty searches, special characters, etc.)
- Complex Wander AI search

## Why This Approach?
As a QA Engineer, I believe in writing tests that are:
- Easy to understand
- Easy to maintain
- Reliable and robust
- Well-documented

I structured this project to demonstrate not just my technical abilities with Cypress, but also my understanding of good testing practices and consideration for future maintainers of the code.


## Notes for Reviewers
- Tests were carried out on Wander's staging environment
- Tests are focused on the search functionality as requested
- Custom commands can be found in the support/commands.js file
- Both test files achieve the same coverage but showcase different styles
- All tests are documented with clear comments explaining the testing strategy

Thank you for taking the time to review my submission! 🙏
