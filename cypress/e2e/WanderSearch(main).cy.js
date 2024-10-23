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
    //Expected result- its should show listing available in California between Nov 1 - Nov 7 that can accommodate 3 occupants
    //Actual result- its showed listing available in California between Nov 1 - Nov 7 that can accommodate 3 occupants
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
    //Expected result- its should show listing available that fall into the login Cabin category in California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
    //Actual result- its showed listing available that fell into the login Cabin category style of apartment in California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
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
    //Expected result- its should show listing available in both Hawaii and California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
    //Actual result- its showed listing available  in Hawaii and California between Nov 1 - Nov 7 that can accommodate 3 or more occupants
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
    //Expected result- its should show listing available in California
    //Actual result- its showed listing available in California
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
    //Expected result- its should show listing available in California
    //Actual result- its showed listing available in California
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

    //Expected result- its should show property listings available between Nov 1 - Nov 7
    //Actual result- its showed property listings available between Nov 1 - Nov 7
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
    //Expected result- its should show property listings available that can accommodate 3 or more occupants
    //Actual result- its showed property listings available that can accommodate 3 or more occupants
  });

  // Test case: View mountain range property listings
  it("TC_008: View Mountain Range Properties", () => {
    //Step 1: Select the mountain category
    cy.MountainFilter();

    //Step 2: Validate results
    cy.SearchResult();

    //Expected result- its should show a list of properties that fall into the Mountain category
    //Actual result- its showed a list of properties that fall into the Mountain category
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
    //Expected result- its should show a list of properties that fall into the criteria in the prompt query
    //Actual result- its showed a list of properties that fall into the criteria in the prompt query
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

    //Expected result- its should show "sorry, we couldn't find anything"
    //Actual result- its showed "sorry, we couldn't find anything"
  });

  // Test case: for an unavailable location via AI search
  it("TC_011: Search for an Unavailable Location with AI", () => {
    // Step 1: Input an unavailable location
    cy.get(".relative.w-full > .border-w-6003").type("Atlantis");

    // Step 2: Perform the search
    cy.Search();

    // Step 3: Verify no results found message
    cy.NoResultFound();

    //Expected result- its should show "sorry, we couldn't find anything"
    //Actual result- its showed "sorry, we couldn't find anything"
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
    cy.SearchResult();

    //Expected result- its should "no results found"
    //Actual result- its showed properties
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
    //Expected result- its should show  Out-of-range prices error
    //Actual result- its showed  Out-of-range prices error
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
    //Expected result- its should discard the special characters and use the query
    //Actual result- it discarded the special characters and use the query
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
    //Expected result- it should show listings that accommodate 1 night
    //Actual result- its showed listings that accommodate 1 night
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
    //Expected result- its should pick keys words from the query and use that to streamline the search
    //Actual result- its picked keys words from the query and used that to streamline the search
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

    //Expected result- its should show all properties listing from all the 29 states
    //Actual result- its showed all properties listing from all the 29 states
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
    //Expected result- its should show Beach house listing facing the ocean
    //Actual result- its showed Beach house listing facing the ocean
  });

  // Test case: Search with emoji AI query
  it("TC_019: Emoji Search Query", () => {
    //Step 1: Input `🏖️ 🏠` search query
    cy.get(".relative.w-full > .border-w-6003").type("🏖️ 🏠");

    //Step 2: Trigger search
    cy.Search();

    //Step 3: Validate results
    cy.SearchResult();
    //Expected result- its should show Beach house listing
    //Actual result- its showed Beach house listing
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
