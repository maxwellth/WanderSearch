describe("Wander Search Functionality", () => {
  beforeEach(() => {
    cy.visit("/"); // Navigate to staging.wander.com homepage
    cy.title().should("eq", "Luxury Vacation Home Rentals by Wander"); // Verify the correct title
  });

  // Test case: Perform a valid search using all filters except AI
  it("TC_001: Valid Search with All Filters (without AI)", () => {
    //Step 1: Open the location filter dropdown and select a location
    cy.openLocationDropdown();
    cy.SetCalifornia(); // Select California

    //Step 2: Open the date range filter and select the start and end dates
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    //Step 3: Open the occupancy filter and select the number of occupants
    cy.OpenOccupancyDropdown();
    cy.Occupants3();

    // Step 4: Trigger the search
    cy.Search();

    // Step 5: Validate the search results are displayed
    cy.get("#properties-list > :nth-child(1)")
      .should("be.visible")
      .should("contain", "Nov 1 - Nov 7");
  });

  // Test case: Perform a valid search using all filters including AI
  it("TC_002: Valid Search with All Filters (with AI)", () => {
    //Step 1: Open location filter and select a location
    cy.openLocationDropdown();
    cy.SetCalifornia();

    //Step 2: Select date range
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    //Step 3: Select occupancy
    cy.OpenOccupancyDropdown();
    cy.get(".row-start-1 > :nth-child(3)").click(); // Select third option
    cy.get(".row-start-1 > :nth-child(3)").click();
    cy.get(".row-start-1 > :nth-child(3)").click();

    // Step 4: Add AI-specific search input
    cy.AISearch("Log cabins");

    // Step 5: Trigger search
    cy.Search();

    // Step 6: Validate results
    cy.SearchResult();
  });

  // Test case: Perform multi-location selection search (Hawaii & California)
  it("TC_003: Multi-Location Selection (Hawaii & California)", () => {
    //Step 1: Open location filter and select two locations
    cy.openLocationDropdown();
    cy.MultipleLocationSelection();

    //Step 2: Select date range
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    //Step 3: Select occupancy
    cy.OpenOccupancyDropdown();
    cy.Occupants9();
 
    //Step 4: Trigger the search
    cy.Search();

    //Step 5: Validate search results
    cy.SearchResult();
  //   cy.verifyUrl({
  //     checkIn: "2024-11-01",
  //     checkOut: "2024-11-07",
  //     minOccupancy: "3",
  //     states: "california,hawaii",
  //   });
  });

  // Test case: Case-insensitive search for location
  it("TC_004: Case-Insensitive Location Search with Wander AI", () => {
    // Step 1: Perform a search with a case-insensitive location input
    cy.get(".relative.w-full > .border-w-6003").type("CaLifOrNiA");

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate the search results
    cy.SearchResult();
    cy.url().should(
      "eq",
      "https://staging.wander.com/?search=CaLifOrNiA____%7C"
    );
  });

  // Test case: Valid search using only Location filter without AI
  it("TC_005: Valid Search with Single Filter (without AI)  using Location", () => {
    //Step 1: Open location filter and select a location
    cy.openLocationDropdown();
    cy.SetCalifornia();

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Valid search using only Date filter without AI
  it("TC_006: Valid Search with Single Filter (without AI)  using only Date", () => {
    //Step 1: Select date range
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Valid search using only Occupants filter without AI
  it("TC_007: Valid Search with Single Filter (without AI) using Occupants", () => {
    //Step 1: Open location filter and select a location
    cy.OpenOccupancyDropdown();
    cy.OccupantsSelection();

    //Step 2: Trigger search
    cy.Search();

    //3 Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: View mountain range property listings
  it("TC_008: View Mountain Range Properties", () => {
    //Step 1: Select the mountain category
    cy.MountainFilter();

    //Step 2: Validate results
    cy.SearchResult();
  });

  // Test case: Test AI with complex natural language search query
  it("TC_009: Complex Search with AI", () => {
    const complexQuery =
      "a digital nomad named Anya, is planning a month-long workcation in California. She wants to find a destination with a strong digital nomad community, affordable cost of living, and plenty of outdoor activities. Her budget is $12,000 per month, and she prefers to stay in a desert cabin";

    //Step 1: Input complex search query
    cy.get(".relative.w-full > .border-w-6003").type(complexQuery);

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Test search with max occupants
  it("TC_010: Search with Max 30 occupants", () => {
    //Step 1: Open the location filter dropdown and select a location
    cy.openLocationDropdown();

    //Step 2: Select California
    cy.SetCalifornia(); // Select California

    //Step 3: Open the occupancy filter dropdown
    cy.OpenOccupancyDropdown();

    //Step 4: Cache the occupant button element for multiple clicks
    cy.get(".row-start-1 > :nth-child(3)").as("occupantButton");

    //Step 5: Click the occupant button 30 times to reach max occupancy
    const maxClicks = 30; // Number of times to click to reach the max occupants
    for (let i = 0; i < maxClicks; i++) {
      cy.get(".row-start-1 > :nth-child(3)").click();
    }

    //Step 6: Trigger the search
    cy.Search();

    //Step 7: Verify the error message or fallback message is displayed
    cy.NoResultFound();
  });

  // Test case: for an unavailable location via AI search
  it("TC_011: Search for an Unavailable Location with AI", () => {
    // Step 1: Input an unavailable location
    cy.get(".relative.w-full > .border-w-6003").type("Atlantis");

    // Step 2: Perform the search
    cy.Search();

    // Step 3: Verify no results found message
    cy.NoResultFound();
  });

  it("TC_012: Verify No Results Found for Non-Existent AI Query", () => {
    // Step 1: Select a location
    cy.openLocationDropdown();
    cy.SetCalifornia(); // Select California

    // Step 2: Input AI search query that likely won't match any property
    cy.get(".relative.w-full > .border-w-6003").type("Unicorn Villa");

    // Step 3: Perform the search
    cy.Search();

    // Step 4: Verify no results found message
    cy.get("#properties-list")
      .should("contain.text", "We couldn't find anything")
      .and(
        "contain.text",
        "Kingston, New YorkWander Hudson Valley Next available:"
      );
  });

  it("TC_013: Verify Search with location and invalid Min and Max Price", () => {
    // Step 1: Open the location filter
    cy.openLocationDropdown();

    // Step 2: Select a location (California)
    cy.SetCalifornia(); // Select California

    //Step 3: Open the date range filter and select the start and end dates
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    // Step 4: Open the price range filter
    cy.OpenPriceDropdown();

    // Step 5: Set the minimum price to an invalid value
    cy.SetAmount("$90000");

    // Step 6: Set the maximum price to an invalid value
    cy.SetAmount2("$1290000");

    // Step 7: Perform the search
    cy.Search();

    // Step 8: Verify the search result indicates out-of-range prices
    cy.OutOfPrice();
  });

  // Test case: Search with special characters in AI query
  it("TC_014: Special Characters in AI Search Query", () => {
    //Step 1: Input special characters in AI search
    cy.get(".relative.w-full > .border-w-6003").type(
      "Beach house with pool & hot-tub @ California!"
    );
    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results are displayed
    cy.SearchResult();
    cy.CaliResult();
    
  });

  // Test case: Search with extremely short date range
  it("TC_015: Single Night Stay Search", () => {
    //Step 1: Open date range filter
    cy.OpenDatePicker();

    //Step 2: Select same date for check-in and check-out
    cy.ShortDateRange();

    //Step 3: Trigger search
    cy.Search();

    //Step 4: Validate results
    cy.SearchResult();
  });

  // Test case: Search withLong AI query
  it("TC_016: Long Description AI Search", () => {
    const longQuery =
      `I'm looking for a luxurious mountain retreat with stunning panoramic views, 
    a fully equipped kitchen, outdoor entertainment area, fire pit, hot tub, and modern amenities. 
    The property should be pet-friendly, have high-speed internet for remote work, and be within 
    30 minutes of skiing. Preferably in a quiet location but not too remote from restaurants and shops. 
    Would love a property with a games room and home theater.`.repeat(3);

    //Step 1: Input long AI search query
    cy.get(".relative.w-full > .border-w-6003").type(longQuery);

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Search with all locations selected
  it("TC_017: All Locations Selected Search", () => {
    //Step 1: Open location filter
    cy.openLocationDropdown();

    //Step 2: Select all available locations
    cy.AllLocations();

    //Step 3: Trigger search
    cy.Search();

    //Step 4: Validate results
    cy.SearchResult();
  });

  // Test case: Search with multilingual AI query
  it("TC_018: Multilingual AI Search Query", () => {
    //Step 1: Input multilingual search query
    cy.get(".relative.w-full > .border-w-6003").type(
      "Beach house cerca de la playa with piscina and vue sur l'océan"
    );

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Search with emoji AI query
  it("TC_019: Emoji Search Query", () => {
    //Step 1: Input `🏖️ 🏠` search query
    cy.get(".relative.w-full > .border-w-6003").type("🏖️ 🏠");

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
  });

  // Test case: Use Filters to search for Early access property listings
  it("TC_020: View Early Access Properties", () => {
    //Step 1: Open the location filter dropdown and select a location
    cy.openLocationDropdown();
    cy.SetCalifornia(); // Select California

    //Step 2: Open the date range filter and select the start and end dates
    cy.OpenDatePicker(); //Open Date Picker
    cy.Set1Week(); //Nov1-7

    //Step 3: Open the occupancy filter and select the number of occupants
    cy.OpenOccupancyDropdown();
    cy.Occupants3();

    //Step 4: Apply Filter Early Access
    cy.EarlyAccessFilter();
    //Step 5: Validate results
    cy.SearchResult();
  });
});
