class MainPage {
    fillSearchFieldByTitle(title){
        return cy.get("[type='text']").first().type(title);
    }

    getButtonByText(text) {
        return cy.get("button").contains(text);
    }

    spinner() {
        return cy.get("[type='rotate']");
    }

    productCardTitle() {
        return cy.get("[data-e2e='product-card'] h3")
    }

    addToCartButton() {
        return cy.get("[data-e2e='add-to-cart-button']")
    }

    productOptions() {
        return cy.get("span b");
    }



}
export const mainPage = new MainPage()