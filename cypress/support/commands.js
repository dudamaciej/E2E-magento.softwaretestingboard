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

Cypress.Commands.add('findProductOnPage', (name) => {
    cy.get('ol[class*="products"]').then($container => {
        if ($container.find(`li[class*="product"]:contains("${name}")`).length) {
            return true;
        } else {
            return false;
        };
    }).then(isProductfound => {
        if (isProductfound) {
            return cy.log(`Found product "${name}"`);
        } else {
            if (Cypress.$('.pages-item-next').length) {
                cy.get('.pages-item-next').eq(1).click();
                cy.waitForContext();
                return cy.findProductOnPage(name);
            } else {
                throw new Error(`Couldn't find product "${name}" on any page`);
            };
        };
    });
});

Cypress.Commands.add('addProductToCart', (name) => {
    cy.get('ol[class*="products"]').find('li[class*="product"]').contains(name).parents('.product-item-info').then((product) => {
        cy.wrap(product).find('.product-item-name').invoke('text').then((text) => {
            expect(text.trim()).to.be.eq(name);
        });
        cy.wrap(product).scrollIntoView().realHover().find('button[title="Add to Cart"]').click({ force: true });
    });
    cy.waitForContext();
    cy.get('div[role="alert"]').invoke('text').should('contain', name);
});