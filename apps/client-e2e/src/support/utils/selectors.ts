/**
 * Creates a selector string for data-testid attribute
 * @param testId - The test id value
 * @returns CSS selector string
 */
export const getByTestId = (testId: string): string => {
  return `[data-testid="${testId}"]`;
};

/**
 * Creates a Cypress chainable element by test id
 * @param testId - The test id value
 * @param options - Optional Cypress options
 */
export const cyGetByTestId = (testId: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>) => {
  return cy.get(getByTestId(testId), options);
};
