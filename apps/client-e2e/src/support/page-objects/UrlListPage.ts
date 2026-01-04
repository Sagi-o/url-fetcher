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
    paginationContainer: getByTestId('pagination-container'),
    paginationControls: getByTestId('pagination-controls'),
    nextPageBtn: getByTestId('next-page-btn'),
    prevPageBtn: getByTestId('prev-page-btn'),
    sortControl: getByTestId('sort-control'),
    sortOrderToggle: getByTestId('sort-order-toggle'),
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
    cy.get(this.selectors.fetchButton).scrollIntoView().click({ force: true });
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
    cy.get(this.selectors.urlCard).filter(`[data-url="${url}"]`).scrollIntoView().click({ force: true });
    cy.wait(500);
    return this;
  }

  clickFirstUrlCard() {
    cy.get(this.selectors.urlCard).first().scrollIntoView().click({ force: true });
    cy.wait(500);
    return this;
  }

  waitForUrlToComplete(url: string, timeout = 10000) {
    cy.get(this.selectors.urlCard, { timeout })
      .filter(`[data-url="${url}"]`)
      .should('have.attr', 'data-status')
      .and('not.equal', 'loading');
    return this;
  }

  // Pagination actions
  shouldShowPagination() {
    cy.get(this.selectors.paginationContainer).should('be.visible');
    return this;
  }

  shouldNotShowPagination() {
    cy.get(this.selectors.paginationContainer).should('not.exist');
    return this;
  }

  clickNextPage() {
    // Scroll pagination into view first
    cy.get(this.selectors.paginationContainer).scrollIntoView();
    // Click the parent button that contains the next icon
    cy.get(this.selectors.nextPageBtn).parent('button').click({ force: true });
    // Wait for URL to update
    cy.wait(1000);
    return this;
  }

  clickPreviousPage() {
    // Scroll pagination into view first
    cy.get(this.selectors.paginationContainer).scrollIntoView();
    // Click the parent button that contains the prev icon
    cy.get(this.selectors.prevPageBtn).parent('button').click({ force: true });
    // Wait for URL to update
    cy.wait(1000);
    return this;
  }

  clickPage(pageNumber: number) {
    // Click on the page number button within pagination controls
    cy.get(this.selectors.paginationControls).contains(pageNumber.toString()).click();
    // Wait for URL to update
    cy.wait(500);
    return this;
  }

  shouldShowUrlCount(count: number) {
    cy.get(this.selectors.urlCard).should('have.length', count);
    return this;
  }

  shouldHavePageInUrl(page: number) {
    cy.url().should('include', `page=${page}`);
    return this;
  }

  shouldHaveSortInUrl(sortBy: string, order: string) {
    cy.url().should('include', `sortBy=${sortBy}`);
    cy.url().should('include', `order=${order}`);
    return this;
  }

  clickSortOrderToggle() {
    cy.get(this.selectors.sortOrderToggle).scrollIntoView().click({ force: true });
    cy.wait(500);
    return this;
  }
}
