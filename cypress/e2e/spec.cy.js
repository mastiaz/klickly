import {mainPage} from "../pageObjects/main-page";

describe('Marketplace testing', () => {
  beforeEach(() => {
    cy.intercept('GET', "**/brands").as("brandsRequest");
    cy.intercept('GET', "**/promotions?page=1").as("promotionsRequest");
    cy.visit('/');
    cy.wait("@brandsRequest")
    cy.wait("@promotionsRequest").then(promotionsRequest => {
      cy.wrap(promotionsRequest.response.body).as("firstPromotionsRequest")
    })
  })

  context("TEST CASE 1", () => {
    it('Verify user is able to search product and navigate to its page', () => {
      const productTitle = "Snowboard";
      mainPage.fillSearchFieldByTitle(productTitle);
      mainPage.spinner().should("not.exist");
      mainPage.productOptions().should("exist");
      mainPage.getButtonByText("Search").click();
      mainPage.productCardTitle().first().should("contain.text", productTitle).click();
      mainPage.addToCartButton().should("be.visible");
    })
  })

  context("TEST CASE 2", () => {
    it('Verify products contain STAR WARS words in title', () => {
      mainPage.fillSearchFieldByTitle("STAR WARS");
      mainPage.spinner().should("not.exist");
      mainPage.productOptions().should("exist");
      mainPage.getButtonByText("Search").click();
      mainPage.productCardTitle().should((titles) => {
        const starWarsTitleCount = titles.filter((index, element) => {
          return /STAR WARS/i.test(element.innerText);
        }).length;

        expect(starWarsTitleCount).to.be.at.least(2);
      });
    })

    it('Verify STAR WARS: Warsong Battlegrounds product exists', () => {
      mainPage.fillSearchFieldByTitle("STAR WARS");
      mainPage.spinner().should("not.exist");
      mainPage.productOptions().should("exist");
      mainPage.getButtonByText("Search").click();
      mainPage.productCardTitle().first().should("have.text","Warsong Battlegrounds").should("exist");
    })

    it('Interception', () => {
      const productTitle = "ROGUE ONE: A STAR WARS STORY [4K UHD]";
      cy.intercept('GET', '**/search**').as("searchRequest");
      mainPage.fillSearchFieldByTitle("STAR WARS");
      mainPage.spinner().should("not.exist");
      mainPage.productOptions().should("exist");
      mainPage.getButtonByText("Search").click();
      cy.wait("@searchRequest").then(searchRequest => {
        const response = searchRequest.response.body;
        const products = response.promotions.map(product => product.title);
        if (!products.find(title => title === productTitle)) {
          throw `Product with title ${productTitle} was not found, ${response}`
        }
      })
    })
  })

  context("TEST CASE 3", () => {
    it('Verify products are different on another page', function() {
      cy.intercept("GET", "**/promotions?page=2").as("secondPromotionsRequest");
      cy.log(this.firstPromotionsRequest);
      mainPage.productCardTitle().last().scrollIntoView();
      cy.wait("@secondPromotionsRequest").then(secondPromotionsRequest => {
        const body = secondPromotionsRequest.response.body;
        const secondPageProductIds = body.promotions.map(product => product.id);
        const firstPageProductIds = this.firstPromotionsRequest.promotions.map(product => product.id);
        firstPageProductIds.forEach(id => {
          expect(secondPageProductIds).not.include(id);
        })
      })
    })
  })
})

