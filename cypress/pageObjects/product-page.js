class ProductPage {
    addToCartButton() {
        return cy.get("[data-e2e='add-to-cart-button']")
    }





}
export const productPage = new ProductPage()