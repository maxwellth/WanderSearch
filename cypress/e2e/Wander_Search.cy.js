describe("Wander Search Functionality", () => {
  // Utility function to select a location
  const selectLocation = (locationName) => {
    cy.get('[data-testid="location-filter"]').should("be.visible").click();
    cy.contains(locationName).click();
  };

  // Utility function to select date range
  const selectDateRange = (startDate, endDate) => {
    cy.get('[data-testid="date-range-filter"]').should("be.visible").click();
    cy.get(`[aria-label="${startDate}"]`).click(); // Example: "November 1, 2024"
    cy.get(`[aria-label="${endDate}"]`).click(); // Example: "November 7, 2024"
  };

  // Utility function to select occupancy
  const selectOccupancy = (occupants) => {
    cy.get('[data-testid="occupancy-filter"]').should("be.visible").click();
    cy.get(`[data-occupants="${occupants}"]`).click(); // Select occupants based on provided number
  };

  // Utility function to submit search
  const submitSearch = () => {
    cy.get('[data-testid="search-button"]').click();
  };

  beforeEach(() => {
    cy.visit("https://www.wander.com/");
    cy.title().should("eq", "Luxury Vacation Home Rentals by Wander");
  });

  // TC_001: Valid search using all filters (without AI)
  it("TC_001: Valid Search with All Filters (without AI)", () => {
    selectLocation("California");
    selectDateRange("November 1, 2024", "November 7, 2024");
    selectOccupancy(3);
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_002: Valid search using all filters including AI
  it("TC_002: Valid Search with All Filters (with AI)", () => {
    selectLocation("California");
    selectDateRange("November 1, 2024", "November 7, 2024");
    selectOccupancy(3);
    cy.get('[data-testid="ai-search"]').type("Beach House");
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_003: Multi-location search (Florida & California)
  it("TC_003: Multi-Location Selection (Florida & California)", () => {
    selectLocation("California");
    selectLocation("Florida");
    selectDateRange("November 1, 2024", "November 7, 2024");
    selectOccupancy(3);
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_004: Case-insensitive location search
  it("TC_004: Case-Insensitive Location Search", () => {
    cy.get('[data-testid="ai-search"]').type("CaLifOrNiA");
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_005: Valid search with location only
  it("TC_005: Valid Search with Single Filter (without AI)", () => {
    selectLocation("California");
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_006: View mountain properties
  it("TC_006: View Mountain Range Properties", () => {
    cy.get('[data-category="mountains"]').click();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_007: Complex AI search with a natural language query
  it("TC_007: Complex Search with AI", () => {
    const query =
      "a digital nomad named Anya is planning a month-long workcation in California...";
    cy.get('[data-testid="ai-search"]').type(query);
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_008: Search with max occupants (30)
  it("TC_008: Search with Max 30 occupants", () => {
    selectLocation("California");
    selectOccupancy(30);
    submitSearch();
    cy.get('[data-testid="error-message"]').should(
      "contain.text",
      "Sorry, there is nothing available that matches your filters"
    );
  });

  // TC_009: Unavailable location search via AI
  it("TC_009: Search for an Unavailable Location", () => {
    cy.get('[data-testid="ai-search"]').type("Atlantis");
    submitSearch();
    cy.get('[data-testid="error-message"]').should(
      "contain.text",
      "Sorry, there is nothing available that matches your filters"
    );
  });

  // TC_010: Invalid AI query
  it("TC_010: Verify No Results Found for Non-Existent AI Query", () => {
    selectLocation("California");
    cy.get('[data-testid="ai-search"]').type("Unicorn Villa");
    submitSearch();
    cy.get('[data-testid="error-message"]').should(
      "contain.text",
      "Sorry, there is nothing available that matches your filters"
    );
  });

  // TC_011: Invalid price range search
  it("TC_011: Verify Search with Invalid Min and Max Price", () => {
    selectLocation("California");
    cy.get('[data-testid="price-min"]').clear().type("90000");
    cy.get('[data-testid="price-max"]').clear().type("1290000");
    submitSearch();
    cy.get('[data-testid="error-message"]').should(
      "contain.text",
      "Out Of Price Range"
    );
  });

  // TC_012: AI search with special characters
  it("TC_012: Special Characters in AI Search Query", () => {
    cy.get('[data-testid="ai-search"]').type(
      "Beach house with pool & hot-tub @ California!"
    );
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_013: Search with extremely short date range
  it("TC_013: Single Night Stay Search", () => {
    selectDateRange("November 1, 2024", "November 2, 2024");
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_014: Long description AI search
  it("TC_014: Long Description AI Search", () => {
    const longQuery = `I'm looking for a luxurious mountain retreat...`.repeat(
      3
    );
    cy.get('[data-testid="ai-search"]').type(longQuery);
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });

  // TC_015: Search with all locations selected
  it("TC_015: All Locations Selected Search", () => {
    cy.get('[data-testid="location-filter"]').click();
    cy.get('[data-testid="location-select-all"]').click();
    submitSearch();
    cy.get('[data-testid="property-list"]').should("be.visible");
  });
});
