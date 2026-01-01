/**
 * Base Page Object with common utilities
 */
export abstract class BasePage {
  /**
   * Wait for page to be fully loaded
   */
  waitForPageLoad() {
    cy.window().should('have.property', 'document');
    return this;
  }

  /**
   * Get element by selector with retry logic
   */
  protected getElement(selector: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>) {
    return cy.get(selector, options);
  }

  /**
   * Click element with force option
   */
  protected clickElement(selector: string, force = false) {
    cy.get(selector).click({ force });
    return this;
  }

  /**
   * Type text with delay for better reliability
   */
  protected typeText(selector: string, text: string, delay = 0) {
    cy.get(selector).clear().type(text, { delay });
    return this;
  }

  /**
   * Assert element visibility
   */
  protected assertVisible(selector: string) {
    cy.get(selector).should('be.visible');
    return this;
  }

  /**
   * Assert element contains text
   */
  protected assertContainsText(selector: string, text: string) {
    cy.get(selector).should('contain.text', text);
    return this;
  }
}
