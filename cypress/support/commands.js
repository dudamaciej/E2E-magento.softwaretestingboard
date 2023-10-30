Cypress.Commands.add('login', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    cy.get('.panel > .header > .authorization-link > a').should('contain', 'Sign In').click();
    cy.get('input[name="login[username]"]').type(username, { log: false });
    cy.get('input[name="login[password]"]').type(password, { log: false });
    cy.get('button[name="send"][class*="primary"]').click();
    cy.waitForContext();
});

Cypress.Commands.add('logout', () => {
    cy.get('header[class="page-header"]').find('li[class="customer-welcome"]').click();
    cy.get('div[class="customer-menu"][aria-hidden="false"]').find('li[class="authorization-link"]').click();
    cy.url('pathname').should('include', 'logoutSuccess');
});

Cypress.Commands.add('waitForContext', () => {
    cy.get(':nth-child(2) > .greet > .logged-in', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('searchProductByName', (name) => {
    cy.get('#search_mini_form').type(`${name}{enter}`);
    cy.waitForContext();
});

Cypress.Commands.add('changeQuantityOfProductInCart', (name, quantity) => {
    cy.intercept("POST", "**/updateItemQty").as('postUpdateItemQty');
    cy.intercept("GET", "**/section/load/?sections=cart**").as('getLoadedCartChanges');
    cy.get('#mini-cart').should('be.visible').find('.product-item-name').contains(name).parents('.product-item').then((cartElement) => {
        cy.wrap(cartElement).find('.details-qty > input').clear().type(quantity);
        cy.wrap(cartElement).find('button[title="Update"]').click();
    });
    cy.wait('@postUpdateItemQty');
    cy.wait('@getLoadedCartChanges');
    cy.get('#mini-cart').should('be.visible').find('.product-item-name').contains(name).parents('.product-item').then((cartElement) => {
        cy.wrap(cartElement).find('.details-qty > input').should('have.attr', 'data-item-qty', quantity);
    });
});

Cypress.Commands.add('deleteItemFromCart', (name) => {
    cy.intercept("POST", "**/removeItem").as("postRemoveItemFromCart");
    cy.get('#mini-cart').should('be.visible').find('.product-item-name').contains(name).parents('.product-item').then((cartElement) => {
        cy.wrap(cartElement).find('a[title="Remove item"]').click();
    });
    cy.get('.modals-wrapper').find('footer[class="modal-footer"]').find('button[class*="action-accept"]').click();
    cy.wait('@postRemoveItemFromCart');
    cy.get('.block-minicart').should('be.visible').contains(name).should('not.exist');
});