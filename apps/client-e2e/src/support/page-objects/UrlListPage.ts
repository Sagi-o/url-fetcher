import { getByTestId } from '../utils/selectors';

export class UrlListPage {
  // Selectors
  private selectors = {
    urlInput: getByTestId('url-input'),
    fetchButton: getByTestId('fetch-urls-button'),
    emptyState: getByTestId('empty-state'),
    emptyStateMessage: getByTestId('empty-state-message'),
    urlCard: getByTestId('url-card'),
    statusBadge: getByTestId('status-badge'),
    fetchTimeBadge: getByTestId('fetch-time-badge'),
    timeAgo: getByTestId('time-ago'),
    errorMessage: getByTestId('error-message'),
  };

  // Actions
  visit() {
    cy.visit('/');
    return this;
  }

  enterUrls(urls: string | string[]) {
    const urlText = Array.isArray(urls) ? urls.join('\n') : urls;
    cy.get(this.selectors.urlInput).clear().type(urlText);
    return this;
  }

  clickFetchButton() {
    cy.get(this.selectors.fetchButton).click();
    return this;
  }

  submitUrls(urls: string | string[]) {
    this.enterUrls(urls);
    this.clickFetchButton();
    return this;
  }

  // Assertions
  shouldShowEmptyState(message?: string) {
    cy.get(this.selectors.emptyState).should('be.visible');
    if (message) {
      cy.get(this.selectors.emptyStateMessage).should('contain.text', message);
    }
    return this;
  }

  shouldShowUrlCard(url: string) {
    cy.get(this.selectors.urlCard).filter(`[data-url="${url}"]`).should('be.visible');
    return this;
  }

  shouldShowUrlWithStatus(url: string, status: 'loading' | 'success' | 'failed') {
    cy.get(this.selectors.urlCard)
      .filter(`[data-url="${url}"]`)
      .should('be.visible')
      .and('have.attr', 'data-status', status);
    return this;
  }

  shouldNotShowLoadingStatus() {
    cy.get(this.selectors.statusBadge).should('not.contain.text', 'loading');
    return this;
  }

  shouldShowFetchTime() {
    cy.get(this.selectors.fetchTimeBadge).should('be.visible');
    return this;
  }

  shouldShowTimeAgo() {
    cy.get(this.selectors.timeAgo).should('contain.text', 'ago');
    return this;
  }

  shouldShowErrorMessage(url: string) {
    cy.get(this.selectors.urlCard)
      .filter(`[data-url="${url}"]`)
      .find(this.selectors.errorMessage)
      .should('be.visible');
    return this;
  }

  clickUrlCard(url: string) {
    cy.get(this.selectors.urlCard).filter(`[data-url="${url}"]`).click();
    return this;
  }

  waitForUrlToComplete(url: string, timeout = 10000) {
    cy.get(this.selectors.urlCard, { timeout })
      .filter(`[data-url="${url}"]`)
      .should('have.attr', 'data-status')
      .and('not.equal', 'loading');
    return this;
  }
}
