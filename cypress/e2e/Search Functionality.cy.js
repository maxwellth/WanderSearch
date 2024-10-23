// Custom commands for common actions
Cypress.Commands.add("openFilter", (filterIndex) => {
  cy.get(
    `#landing-trip-filters > form > div:nth-child(${filterIndex}) > button`
  )
    .should("be.visible")
    .click();
});

Cypress.Commands.add("selectLocation", (locationIndex) => {
  cy.openFilter(1);
  cy.get(`:nth-child(${locationIndex}) > .grid > .border-w-6003`).click();
});

Cypress.Commands.add("selectDateRange", (startDate, endDate) => {
  cy.openFilter(2);
  cy.get(`[aria-label="${startDate}"]`).click();
  cy.get(`[aria-label="${endDate}"]`).click();
});

Cypress.Commands.add("selectOccupancy", (count) => {
  cy.openFilter(3);
  for (let i = 0; i < count; i++) {
    cy.get(".row-start-1 > :nth-child(3)").click();
  }
});

Cypress.Commands.add("triggerSearch", () => {
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("validateSearchResults", (shouldExist = true) => {
  if (shouldExist) {
    cy.SearchResult();
  } else {
    cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Sorry, there is nothing available that matches your filters"
      );
  }
});

describe("Wander Search Functionality", () => {
  // Test data
  const testData = {
    locations: {
      california: 3,
      florida: 7,
    },
    dates: {
      start: "November 1, 2024",
      end: "November 7, 2024",
    },
    aiQueries: {
      complex:
        "a digital nomad named Anya, is planning a month-long workcation in California. She wants to find a destination with a strong digital nomad community, affordable cost of living, and plenty of outdoor activities. Her budget is $12,000 per month, and she prefers to stay in a desert cabin",
      multilingual:
        "Beach house cerca de la playa with piscina and vue sur l'océan",
      special: "Beach house with pool & hot-tub @ California!",
      emoji: "🏖️ beach house",
    },
  };

  beforeEach(() => {
    cy.intercept("POST", "/api/search").as("searchRequest");
    cy.visit("https://www.wander.com/");
    cy.title().should("eq", "Luxury Vacation Home Rentals by Wander");
  });

  describe("Basic Search Functionality", () => {
    it("should perform search with location only", () => {
      cy.selectLocation(testData.locations.california);
      cy.triggerSearch();
      cy.validateSearchResults();
      cy.wait("@searchRequest").its("response.statusCode").should("eq", 200);
    });

    it("should perform search with all filters except AI", () => {
      cy.selectLocation(testData.locations.california);
      cy.selectDateRange(testData.dates.start, testData.dates.end);
      cy.selectOccupancy(2);
      cy.triggerSearch();
      cy.validateSearchResults();
    });

    it("should handle multi-location selection", () => {
      cy.selectLocation(testData.locations.california);
      cy.selectLocation(testData.locations.florida);
      cy.triggerSearch();
      cy.validateSearchResults();
    });
  });

  describe("AI Search Functionality", () => {
    it("should handle complex natural language queries", () => {
      cy.get(".relative.w-full > .border-w-6003")
        .should("be.visible")
        .type(testData.aiQueries.complex);
      cy.triggerSearch();
      cy.validateSearchResults();
    });

    it("should handle multilingual queries", () => {
      cy.get(".relative.w-full > .border-w-6003")
        .should("be.visible")
        .type(testData.aiQueries.multilingual);
      cy.triggerSearch();
      cy.validateSearchResults();
    });

    it("should handle special characters and emoji", () => {
      cy.get(".relative.w-full > .border-w-6003")
        .should("be.visible")
        .type(testData.aiQueries.special);
      cy.triggerSearch();
      cy.validateSearchResults();

      cy.get(".relative.w-full > .border-w-6003")
        .clear()
        .type(testData.aiQueries.emoji);
      cy.triggerSearch();
      cy.validateSearchResults();
    });
  });

  describe("Error Handling", () => {
    it("should handle unavailable locations", () => {
      cy.get(".relative.w-full > .border-w-6003").type("Atlantis");
      cy.triggerSearch();
      cy.validateSearchResults(false);
    });

    it("should handle invalid date ranges", () => {
      cy.selectLocation(testData.locations.california);
      cy.selectDateRange("December 31, 2024", "December 31, 2024");
      cy.triggerSearch();
      cy.validateSearchResults(false);
    });

    it("should handle maximum occupancy limits", () => {
      cy.selectLocation(testData.locations.california);
      cy.selectOccupancy(31); // Exceeds maximum
      cy.triggerSearch();
      cy.validateSearchResults(false);
    });
  });

  describe("Performance and Network", () => {
    it("should load search results within acceptable time", () => {
      cy.selectLocation(testData.locations.california);
      cy.triggerSearch();

      cy.wait("@searchRequest").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        // Assuming 2 seconds is acceptable response time
        expect(interception.response.duration).to.be.lessThan(2000);
      });
    });

    it("should handle network errors gracefully", () => {
      cy.intercept("POST", "/api/search", {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      }).as("failedSearch");

      cy.selectLocation(testData.locations.california);
      cy.triggerSearch();

      cy.wait("@failedSearch");
      cy.get(".error-message").should("be.visible");
    });
  });
});
