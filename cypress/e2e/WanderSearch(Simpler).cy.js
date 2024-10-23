describe("Wander Search Functionality", () => {
  // Ensure the homepage is loaded before each test
  beforeEach(() => {
    cy.visit("https://www.wander.com"); // Navigate to the homepage
    cy.title().should("eq", "Luxury Vacation Home Rentals by Wander"); // Verify the correct title
  });

  // Test case: Perform a valid search using all filters except AI
  it("TC_001: Valid Search with All Filters (without AI)", () => {
    //Step 1: Open the location filter dropdown and select a location
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();
    cy.get(":nth-child(3) > .grid > .border-w-6003").click();

    //Step 2: Open the date range filter and select the start and end dates
    cy.get("#landing-trip-filters > form > div:nth-child(2) > button")
      .should("be.visible")
      .click();
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
    ).click(); // Select November 1
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div > button:nth-child(5)"
    ).click(); // Select November 7

    //Step 3: Open the occupancy filter and select the number of occupants
    cy.get("#landing-trip-filters > form > div:nth-child(3) > button")
      .should("be.visible")
      .click();
    cy.get(".row-start-1 > :nth-child(3)").click(); // Select third option

    //Step 4: Trigger the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 5: Validate the search results are displayed
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show listing available in California between Nov 1 - Nov 7 that can accommodate 3 occupants
    //Actual result- its showed listing available in California between Nov 1 - Nov 7 that can accommodate 3 occupants
  });

  // Test case: Perform a valid search using all filters including AI
  it("TC_002: Valid Search with All Filters (with AI)", () => {
    //Step 1: Open location filter and select a location
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();
    cy.get(":nth-child(3) > .grid > .border-w-6003").click();

    //Step 2: Select date range
    cy.get("#landing-trip-filters > form > div:nth-child(2) > button")
      .should("be.visible")
      .click();
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
    ).click(); // November 1
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div > button:nth-child(5)"
    ).click(); // November 7

    //Step 3: Select occupancy
    cy.get("#landing-trip-filters > form > div:nth-child(3) > button")
      .should("be.visible")
      .click();
    cy.get(".row-start-1 > :nth-child(3)").click();

    //Step 4: Add AI-specific search input
    cy.get(".relative.w-full > .border-w-6003").type("Beach House");

    //Step 5: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 6: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show listing available that fall into the login Cabin category in California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
    //Actual result- its showed listing available that fell into the login Cabin category style of apartment in California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
  });

  // Test case: Perform multi-location selection search (Florida & California)
  it("TC_003: Multi-Location Selection (Florida & California)", () => {
    //Step 1: Open location filter and select two locations
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();
    cy.get(":nth-child(3) > .grid > .border-w-6003").click(); // Select California
    cy.get(":nth-child(7) > .grid > .border-w-6003").click(); // Select Florida

    //Step 2: Select date range
    cy.get("#landing-trip-filters > form > div:nth-child(2) > button")
      .should("be.visible")
      .click();
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
    ).click(); // November 1
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(3) > div > button:nth-child(5)"
    ).click(); // November 7

    //Step 3: Select occupancy
    cy.get("#landing-trip-filters > form > div:nth-child(3) > button")
      .should("be.visible")
      .click();
    cy.get(".row-start-1 > :nth-child(3)").click();

    //Step 4: Trigger the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 5: Validate search results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show listing available in both Hawaii and California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
    //Actual result- its showed listing available  in Hawaii and California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
  });

  // Test case: Case-insensitive search for location
  it("TC_004: Case-Insensitive Location Search", () => {
    //Step 1: Perform a search with a case-insensitive location input
    cy.get(".relative.w-full > .border-w-6003").type("CaLifOrNiA");

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate the search results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show listing available in California
    //Actual result- its showed listing available in California
  });

  // Test case: Valid search using only location filter without AI
  it("TC_005: Valid Search with Single Filter (without AI)", () => {
    //Step 1: Open location filter and select a location
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();
    cy.get(":nth-child(3) > .grid > .border-w-6003").click();

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show listing available in California
    //Actual result- its showed listing available in California
  });

  
  // Test case: View mountain range property listings
  it("TC_006: View Mountain Range Properties", () => {
    //Step 1: Select the mountain category
    cy.get('[data-category="mountains"]').click();

    //Step 2: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show property listings available between Nov 1 - Nov 7
    //Actual result- its showed property listings available between Nov 1 - Nov 7
  });

  // Test case: Test AI with complex natural language search query
  it("TC_007: Complex Search with AI", () => {
    const complexQuery =
      "a digital nomad named Anya, is planning a month-long workcation in California. She wants to find a destination with a strong digital nomad community, affordable cost of living, and plenty of outdoor activities. Her budget is $12,000 per month, and she prefers to stay in a desert cabin";

    //Step 1: Input complex search query
    cy.get(".relative.w-full > .border-w-6003").type(complexQuery);

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show property listings available that can accommodate 3 or more occupants
    //Actual result- its showed property listings available that can accommodate 3 or more occupants
  });

  // Test case: Test search with max occupants
  it("TC_008: Search with Max 30 occupants", () => {
    //Step 1: Open the location filter dropdown and select a location
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();

    //Step 2: Select California
    cy.get(":nth-child(3) > .grid > .border-w-6003").click();

    //Step 3: Open the occupancy filter dropdown
    cy.get("#landing-trip-filters > form > div:nth-child(3) > button")
      .should("be.visible")
      .click();

    //Step 4: Cache the occupant button element for multiple clicks
    cy.get(".row-start-1 > :nth-child(3)").as("occupantButton");

    //Step 5: Click the occupant button 30 times to reach max occupancy
    const maxClicks = 30; // Number of times to click to reach the max occupants
    for (let i = 0; i < maxClicks; i++) {
      cy.get(".row-start-1 > :nth-child(3)").click();
    }

    //Step 6: Trigger the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 7: Verify the error message or fallback message is displayed
    cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Sorry, there is nothing available that matches your filters"
      );
  });

  // Test case: for an unavailable location via AI search
  it("TC_009: Search for an Unavailable Location", () => {
    // Step 1: Input an unavailable location
    cy.get(".relative.w-full > .border-w-6003").type("Atlantis");

    // Step 2: Perform the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    // Step 3: Verify no results found message
    cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Sorry, there is nothing available that matches your filters"
      );
  });

  it("TC_010: Verify No Results Found for Non-Existent AI Query", () => {
    // Step 1: Select a location
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button").click();
    cy.get(":nth-child(3) > .grid > .border-w-6003").click(); // California

    // Step 2: Input AI search query that likely won't match any property
    cy.get(".relative.w-full > .border-w-6003").type("Unicorn Villa");

    // Step 3: Perform the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    // Step 4: Verify no results found message
    cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Sorry, there is nothing available that matches your filters"
      );
  });

  it("TC_011: Verify Search with location and invalid Min and Max Price", () => {
    // Step 1: Open the location filter
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button").click();

    // Step 2: Select a location (California)
    cy.get(":nth-child(3) > .grid > .border-w-6003").click();

    // Step 3: Open the price range filter
    cy.get(".relative.w-full > .border-w-6003").click();

    // Step 4: Set the minimum price to an invalid value
    cy.get(":nth-child(1) > :nth-child(2) > .relative > .border-w-6003")
      .clear() // Clears the input field
      .type("$90000"); // Types the new minimum price value

    // Step 5: Set the maximum price to an invalid value
    cy.get(":nth-child(2) > :nth-child(2) > .relative > .border-w-6003")
      .clear() // Clears the input field
      .type("$1290000"); // Types the new maximum price value

    // Step 6: Perform the search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    // Step 7: Verify the search result indicates out-of-range prices
    cy.get(".col-span-full").should(
      "contain.text",
      "Out Of Price Range" || "Coming soon"
    );
  });

  // Test case: Search with special characters in AI query
  it("TC_012: Special Characters in AI Search Query", () => {
    //Step 1: Input special characters in AI search
    cy.get(".relative.w-full > .border-w-6003").type(
      "Beach house with pool & hot-tub @ California!"
    );
    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results are displayed
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });

  // Test case: Search with extremely short date range
  it("TC_013: Single Night Stay Search", () => {
    //Step 1: Open date range filter
    cy.get("#landing-trip-filters > form > div:nth-child(2) > button")
      .should("be.visible")
      .click();

    //Step 2: Select same date for check-in and check-out
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(6)"
    ).click(); // Select November 1
    cy.get(
      "#landing-trip-filters > form > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > div > button:nth-child(7)"
    ).click(); // Select November 2

    //Step 3: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 4: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });

  // Test case: Search withLong AI query
  it("TC_014: Long Description AI Search", () => {
    const longQuery =
      `I'm looking for a luxurious mountain retreat with stunning panoramic views, 
    a fully equipped kitchen, outdoor entertainment area, fire pit, hot tub, and modern amenities. 
    The property should be pet-friendly, have high-speed internet for remote work, and be within 
    30 minutes of skiing. Preferably in a quiet location but not too remote from restaurants and shops. 
    Would love a property with a games room and home theater.`.repeat(3);

    //Step 1: Input long AI search query
    cy.get(".relative.w-full > .border-w-6003").type(longQuery);

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });

  // Test case: Search with all locations selected
  it("TC_015: All Locations Selected Search", () => {
    //Step 1: Open location filter
    cy.get("#landing-trip-filters > form > div:nth-child(1) > button")
      .should("be.visible")
      .click();

    //Step 2: Select all available locations
    cy.get(".grid > .border-w-6003").click({ multiple: true });

    //Step 3: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 4: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });

  // Test case: Search with multilingual AI query
  it("TC_016: Multilingual AI Search Query", () => {
    //Step 1: Input multilingual search query
    cy.get(".relative.w-full > .border-w-6003").type(
      "Beach house cerca de la playa with piscina and vue sur l'océan"
    );

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });

  // Test case: Search with emoji AI query
  it("TC_017: Emoji Search Query", () => {
    //Step 1: Input 🏖️ search query
    cy.get(".relative.w-full > .border-w-6003").type("🏖️");

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();

    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
    //Expected result- its should show Beach house listing
    //Actual result- its showed Beach house listing
  });

  it.only("TC_018: Search with amenities", () => {
    //Step 1: Search with 1 amenity
    cy.get(".relative.w-full > .border-w-6003").click();
    cy.get(
      "#landing-trip-filters>form>div:nth-child(4)>div:nth-child(2)>div>div:nth-child(1)>div:nth-child(2)>div>button"
    ).click();

    cy.get(":nth-child(2) > .grid > .border-w-6003").click();

    //Step 2: Trigger search
    cy.get(
      "body > main:nth-child(2) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(4)"
    ).click();
    //Step 3: Validate results
    cy.get("#properties-list > :nth-child(1)").should("be.visible");
  });
});
