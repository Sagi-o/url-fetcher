import { getByTestId } from '../utils/selectors';

export class UrlContentPage {
  // Selectors
  private selectors = {
    contentPage: getByTestId('url-content-page'),
    pageTitle: getByTestId('page-title'),
    currentUrl: getByTestId('current-url'),
    backButton: getByTestId('back-button'),
    previewTab: getByTestId('preview-tab'),
    sourceTab: getByTestId('source-tab'),
    previewPanel: getByTestId('preview-panel'),
    sourcePanel: getByTestId('source-panel'),
    sourceCode: getByTestId('source-code'),
  };

  // Actions
  clickBackButton() {
    cy.get(this.selectors.backButton).click();
    return this;
  }

  clickPreviewTab() {
    cy.get(this.selectors.previewTab).click();
    return this;
  }

  clickSourceTab() {
    cy.get(this.selectors.sourceTab).click();
    return this;
  }

  // Assertions
  shouldBeVisible() {
    cy.get(this.selectors.contentPage).should('be.visible');
    return this;
  }

  shouldShowTitle(title: string) {
    cy.get(this.selectors.pageTitle).should('contain.text', title);
    return this;
  }

  shouldShowCurrentUrl(url: string) {
    cy.get(this.selectors.currentUrl).should('contain.text', url);
    return this;
  }

  shouldShowBackButton() {
    cy.get(this.selectors.backButton).should('be.visible');
    return this;
  }

  shouldShowPreviewPanel() {
    cy.get(this.selectors.previewPanel).should('be.visible');
    return this;
  }

  shouldShowSourcePanel() {
    cy.get(this.selectors.sourcePanel).should('be.visible');
    return this;
  }

  shouldShowSourceCode() {
    cy.get(this.selectors.sourceCode).should('be.visible').and('not.be.empty');
    return this;
  }

  shouldBeOnContentPage() {
    cy.url().should('include', '/content');
    return this;
  }
}
