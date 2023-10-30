describe('E2E - Magento Test Shop', () => {
    before(() => {
        cy.visit('/');
        cy.login();
        cy.fixture('order').then((order) => {
            Cypress.env('order', order);
        });
    });
    it('Search for product, add to cart, change quantity and delete', () => {
        const name = Cypress.env('order').item_name;
        const quantity = Cypress.env('order').quantity;
        cy.searchProductByName(name);
        cy.findProductOnPage(name);
        cy.addProductToCart(name);
        cy.get('.showcart').click();
        cy.changeQuantityOfProductInCart(name, quantity);
        cy.deleteItemFromCart(name);
    });
    after(() => {
        cy.logout();
    });
});