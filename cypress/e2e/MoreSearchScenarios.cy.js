Cypress.Commands.add("selectAmenities", (...amenities) => {
  cy.get('[data-testid="amenities-filter"]').click();
  amenities.forEach((amenity) => {
    cy.get(`[data-amenity="${amenity}"]`).click();
  });
});

Cypress.Commands.add("setPriceRange", (min, max) => {
  cy.get('[data-testid="price-filter"]').click();
  cy.get('[data-testid="min-price"]').clear().type(min);
  cy.get('[data-testid="max-price"]').clear().type(max);
});

Cypress.Commands.add("checkPropertyDetails", () => {
  cy.get("#properties-list > :nth-child(1)").click();
  cy.url().should("include", "/properties/");
  cy.get('[data-testid="property-details"]').should("be.visible");
});

describe("Advanced Wander Search Scenarios", () => {
  // Additional test data
  const testData = {
    amenities: ["pool", "wifi", "gym", "pet-friendly", "kitchen"],
    propertyTypes: ["house", "apartment", "villa", "cabin"],
    priceRanges: {
      budget: { min: 100, max: 300 },
      luxury: { min: 1000, max: 5000 },
    },
    locations: {
      popular: ["Miami", "Las Vegas", "Aspen"],
      international: ["Cancun", "Paris", "Tokyo"],
    },
  };

  beforeEach(() => {
    cy.intercept("POST", "/api/search").as("searchRequest");
    cy.intercept("GET", "/api/properties/*").as("propertyDetails");
    cy.visit("https://www.wander.com/");
  });

  describe("Property Type Filtering", () => {
    testData.propertyTypes.forEach((propertyType) => {
      it(`should filter properties by type: ${propertyType}`, () => {
        cy.get(`[data-property-type="${propertyType}"]`).click();
        cy.triggerSearch();
        cy.validateSearchResults();
        cy.get("#properties-list").should("contain", propertyType);
      });
    });

    it("should combine multiple property types", () => {
      cy.get('[data-property-type="house"]').click();
      cy.get('[data-property-type="villa"]').click();
      cy.triggerSearch();
      cy.validateSearchResults();
      cy.get("#properties-list")
        .should("contain", "house")
        .and("contain", "villa");
    });
  });

  describe("Amenity Combinations", () => {
    it("should filter properties with multiple amenities", () => {
      cy.selectLocation(testData.locations.popular[0]);
      cy.selectAmenities("pool", "wifi", "gym");
      cy.triggerSearch();
      cy.validateSearchResults();

      // Verify amenities in search results
      cy.get("#properties-list > :nth-child(1)").within(() => {
        cy.get('[data-amenity="pool"]').should("exist");
        cy.get('[data-amenity="wifi"]').should("exist");
        cy.get('[data-amenity="gym"]').should("exist");
      });
    });

    it("should handle selecting all amenities", () => {
      cy.selectLocation(testData.locations.popular[0]);
      cy.selectAmenities(...testData.amenities);
      cy.triggerSearch();
      cy.validateSearchResults();
    });
  });

  describe("Price Range Scenarios", () => {
    it("should filter budget-friendly properties", () => {
      cy.setPriceRange(
        testData.priceRanges.budget.min,
        testData.priceRanges.budget.max
      );
      cy.triggerSearch();
      cy.validateSearchResults();

      // Verify prices are within range
      cy.get("#properties-list .property-price").each(($price) => {
        const price = parseInt($price.text().replace(/[^0-9]/g, ""));
        expect(price).to.be.within(
          testData.priceRanges.budget.min,
          testData.priceRanges.budget.max
        );
      });
    });

    it("should filter luxury properties", () => {
      cy.setPriceRange(
        testData.priceRanges.luxury.min,
        testData.priceRanges.luxury.max
      );
      cy.triggerSearch();
      cy.validateSearchResults();
    });
  });

  describe("Seasonal Search Patterns", () => {
    it("should handle holiday season bookings", () => {
      cy.selectLocation(testData.locations.popular[2]); // Aspen
      cy.selectDateRange("December 24, 2024", "January 2, 2025");
      cy.selectOccupancy(4);
      cy.triggerSearch();
      cy.validateSearchResults();
    });

    it("should handle off-season bookings", () => {
      cy.selectLocation(testData.locations.popular[0]); // Miami
      cy.selectDateRange("September 15, 2024", "September 22, 2024");
      cy.triggerSearch();
      cy.validateSearchResults();
    });
  });

  describe("Property Details Integration", () => {
    it("should display accurate property details from search results", () => {
      cy.selectLocation(testData.locations.popular[0]);
      cy.triggerSearch();

      // Store search result data
      cy.get("#properties-list > :nth-child(1)").then(($property) => {
        const propertyData = {
          title: $property.find(".property-title").text(),
          price: $property.find(".property-price").text(),
        };

        // Navigate to property details
        cy.checkPropertyDetails();

        // Verify details match search results
        cy.get(".property-title").should("have.text", propertyData.title);
        cy.get(".property-price").should("have.text", propertyData.price);
      });
    });
  });

  describe("Search History and Favorites", () => {
    beforeEach(() => {
      // Assuming user login functionality exists
      cy.login("testuser@example.com", "password");
    });

    it("should save search history", () => {
      // Perform search
      cy.selectLocation(testData.locations.popular[0]);
      cy.triggerSearch();

      // Navigate to search history
      cy.get('[data-testid="search-history"]').click();
      cy.get(".history-item")
        .first()
        .should("contain", testData.locations.popular[0]);
    });

    it("should add property to favorites", () => {
      cy.selectLocation(testData.locations.popular[0]);
      cy.triggerSearch();

      // Add first property to favorites
      cy.get("#properties-list > :nth-child(1)").within(() => {
        cy.get('[data-testid="favorite-button"]').click();
      });

      // Verify in favorites
      cy.get('[data-testid="favorites-link"]').click();
      cy.get(".favorites-list").should("not.be.empty");
    });
  });

  describe("Mobile Responsiveness", () => {
    const viewports = [
      { width: 375, height: 667, device: "iPhone SE" },
      { width: 768, height: 1024, device: "iPad" },
      { width: 1024, height: 768, device: "iPad landscape" },
    ];

    viewports.forEach((viewport) => {
      it(`should display correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);

        // Test search filters visibility
        cy.get('[data-testid="mobile-filters-button"]')
          .should("be.visible")
          .click();
        cy.get('[data-testid="filters-modal"]').should("be.visible");

        // Test search functionality
        cy.selectLocation(testData.locations.popular[0]);
        cy.triggerSearch();
        cy.validateSearchResults();

        // Test property card layout
        cy.SearchResult();
      });
    });
  });

  describe("Accessibility Testing", () => {
    it("should have proper ARIA labels on search filters", () => {
      cy.get('[data-testid="location-filter"]').should(
        "have.attr",
        "aria-label"
      );
      cy.get('[data-testid="date-filter"]').should("have.attr", "aria-label");
      cy.get('[data-testid="occupancy-filter"]').should(
        "have.attr",
        "aria-label"
      );
    });

    it("should maintain focus management", () => {
      // Test focus trap in modals
      cy.get('[data-testid="filters-button"]').click();
      cy.focused().should("have.attr", "data-testid", "modal-close");

      // Test keyboard navigation
      cy.get("body").type("{esc}");
      cy.get('[data-testid="filters-modal"]').should("not.exist");
    });
  });

  describe("Edge Cases and Error Scenarios", () => {
    it("should handle rapid filter changes", () => {
      // Quickly change multiple filters
      cy.selectLocation(testData.locations.popular[0]);
      cy.selectLocation(testData.locations.popular[1]);
      cy.selectDateRange("August 1, 2024", "August 8, 2024");
      cy.setPriceRange(200, 1000);
      cy.triggerSearch();

      // Verify only one API call is made (debouncing)
      cy.get("@searchRequest.all").should("have.length", 1);
    });

    it("should handle session timeout", () => {
      // Simulate session timeout
      cy.intercept("POST", "/api/search", {
        statusCode: 401,
        body: { error: "Session expired" },
      }).as("sessionTimeout");

      cy.selectLocation(testData.locations.popular[0]);
      cy.triggerSearch();

      // Verify user is prompted to login
      cy.get('[data-testid="login-prompt"]').should("be.visible");
    });

    it("should recover from server errors", () => {
      // Simulate server error then recovery
      cy.intercept("POST", "/api/search", {
        statusCode: 500,
      }).as("serverError");

      cy.selectLocation(testData.locations.popular[0]);
      cy.triggerSearch();

      // Verify error message
      cy.get('[data-testid="error-message"]').should("be.visible");

      // Simulate server recovery
      cy.intercept("POST", "/api/search", {
        statusCode: 200,
        fixture: "search-results.json",
      }).as("serverRecovery");

      // Retry search
      cy.get('[data-testid="retry-button"]').click();
      cy.validateSearchResults();
    });
  });
});
