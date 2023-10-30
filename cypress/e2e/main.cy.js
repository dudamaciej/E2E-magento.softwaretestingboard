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
        cy.get('ol[class*="products"]').find('li[class*="product"]').contains(name).parents('.product-item-info').then((product) => {
            cy.wrap(product).find('.product-item-name').invoke('text').then((text) => {
                expect(text.trim()).to.be.eq(name);
            });
            cy.wrap(product).scrollIntoView().realHover().then((card) => {
                cy.wrap(card).find('button[title="Add to Cart"]').click({ force: true });
            });
        });
        cy.waitForContext();
        cy.get('div[role="alert"]').invoke('text').should('contain', name);
        cy.get('.showcart').click();
        cy.changeQuantityOfProductInCart(name, quantity);
        cy.deleteItemFromCart(name);
    });
    after(() => {
        cy.logout();
    });
});