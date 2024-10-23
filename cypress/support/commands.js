/// <reference types="cypress" />
import "cypress-file-upload";
// cypress/support/commands.js

Cypress.Commands.add("openLocationDropdown", () => {
  cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
    .click() // Simulate clicking the button to open the dropdown
    .should("be.visible"); // Ensure the dropdown becomes visible
});

Cypress.Commands.add("OpenDatePicker", () => {
  cy.get("#landing-trip-filters > form > div:nth-child(2) > button")
    .should("be.visible")
    .click();
});

Cypress.Commands.add("OpenOccupancyDropdown", () => {
  cy.get("#landing-trip-filters > form > div:nth-child(3) > button")
    .should("be.visible")
    .click();
});

Cypress.Commands.add("Set1Week", () => {
  cy.get(
    "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
  ).click(); // Select November 1
  cy.get(
    "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div > button:nth-child(5)"
  ).click(); // Select November 7
});

Cypress.Commands.add("SetCalifornia", () => {
  cy.get(":nth-child(3) > .grid > .border-w-6003").click();
});

Cypress.Commands.add("Search", () => {
  cy.get(
    "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
  ).click();
});

Cypress.Commands.add("logMessage", () => {
  cy.log("Custom command is working");
});

Cypress.Commands.add("MultipleLocationSelection", () => {
  cy.get(":nth-child(3) > .grid > .border-w-6003").click(); // Select California
  cy.get(":nth-child(7) > .grid > .border-w-6003").click(); // Select Florida
});

Cypress.Commands.add("AISearch", () => {
  cy.get(".relative.w-full > .border-w-6003").type("Beach Houses");
});

Cypress.Commands.add("verifyUrl", (expectedParams) => {
  cy.url().should("include", Cypress.config("baseUrl")); // Ensures the base URL matches

  // Get the current URL and check the query parameters dynamically
  cy.url().then((currentUrl) => {
    const url = new URL(currentUrl); // Create a URL object
    const params = url.searchParams; // Extract search parameters from the URL

    // Iterate through the expectedParams object and verify each query parameter
    Object.keys(expectedParams).forEach((key) => {
      expect(params.get(key)).to.eq(expectedParams[key]);
    });
  });
});

Cypress.Commands.add("OccupantsSelection", () => {
  const maxClicks = 8; // Number of times to click
  for (let i = 0; i < maxClicks; i++) {
    cy.get(".row-start-1 > :nth-child(3)").click();
  }
});

Cypress.Commands.add("SearchResult", () => {
  cy.get("#properties-list-or-map").should("be.visible");
});


Cypress.Commands.add("MountainFilter", () => {
    cy.get('[data-category="mountains"]').click();
  });

Cypress.Commands.add("OceanFilter", () => {
    cy.get('[data-category="ocean"]').click();
  });

  Cypress.Commands.add("Desert", () => {
    cy.get('[data-category="desert"]').click();
  });

Cypress.Commands.add("ForesFilter", () => {
  cy.get('[data-category="forest"]').click();
});
Cypress.Commands.add("FamilyFilter", () => {
  cy.get('[data-category="family-friendly"]').click();
});
Cypress.Commands.add("NationalParkFilter", () => {
  cy.get('[data-category="national-parks"]').click();
});

Cypress.Commands.add("GolfFilter", () => {
  cy.get('[data-category="golf"]').click();
});

Cypress.Commands.add("SkiingFilter", () => {
  cy.get('[data-category="skiing"]').click();
});

Cypress.Commands.add("PoolsFilter", () => {
  cy.get('[data-category="pool"]').click();
});

Cypress.Commands.add("EarlyAccessFilter", () => {
  cy.get('[data-category="early-access"]').click();
});
Cypress.Commands.add("ComingSoonFilter", () => {
  cy.get('[data-category="coming-soon"]').click();
});

Cypress.Commands.add("NearMeFilter", () => {
  cy.get('[data-category="near-me"]').click();
});
Cypress.Commands.add("LMDFilter", () => {
  cy.get('[data-category="last-minute-deals"]').click();
});
 
Cypress.Commands.add("NoResultFound", () => {
     cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Sorry, there is nothing available that matches your filters"
      );
   });

Cypress.Commands.add("OpenPriceDropdown", () => {
    cy.get(".relative.w-full > .border-w-6003").click();
  });

  Cypress.Commands.add("OutOfPrice", () => {
    cy.get(".col-span-full").should(
      "contain.text",
      "Out Of Price Range" || "Coming soon"
    );
  });



  Cypress.Commands.add("ShortDateRange", () => {
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
    ).click(); // Select November 1
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(7)"
    ).click(); // Select November 2
  });