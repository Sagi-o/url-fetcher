import { UrlListPage, UrlContentPage } from '../support/page-objects';

describe('URL Fetcher E2E', () => {
  const urlListPage = new UrlListPage();
  const urlContentPage = new UrlContentPage();

  beforeEach(() => {
    urlListPage.visit();
  });

  it('should submit URLs and display them in the list', () => {
    // Check initial empty state
    urlListPage.shouldShowEmptyState('No URLs submitted yet');

    // Submit a URL
    urlListPage.submitUrls('example.com');

    // Check that URL appears in the list with loading status
    urlListPage.shouldShowUrlCard('https://example.com');
    urlListPage.shouldShowUrlWithStatus('https://example.com', 'loading');

    // Wait for the URL to be fetched
    urlListPage.waitForUrlToComplete('https://example.com');

    // Should show either success or failed status
    urlListPage.shouldShowUrlCard('https://example.com');
  });

  it('should submit multiple URLs at once', () => {
    // Submit multiple URLs (one per line)
    urlListPage.submitUrls(['example.com', 'google.com']);

    // Check that both URLs appear in the list
    urlListPage
      .shouldShowUrlCard('https://example.com')
      .shouldShowUrlCard('https://google.com');
  });

  it('should navigate to content page on successful URL click', () => {
    // Submit a URL that will succeed
    urlListPage.submitUrls('example.com');

    // Wait for success status
    urlListPage.waitForUrlToComplete('https://example.com');
    urlListPage.shouldShowUrlWithStatus('https://example.com', 'success');

    // Click on the URL card
    urlListPage.clickUrlCard('https://example.com');

    // Should navigate to content page
    urlContentPage
      .shouldBeOnContentPage()
      .shouldShowTitle('URL Content')
      .shouldShowBackButton()
      .shouldShowCurrentUrl('https://example.com');
  });

  it('should display fetch time for completed URLs', () => {
    // Submit a URL
    urlListPage.submitUrls('example.com');

    // Wait for completion
    urlListPage.waitForUrlToComplete('https://example.com');

    // Should show fetch time in milliseconds
    urlListPage.shouldShowFetchTime();
  });

  it('should show relative time (x ago) for URLs', () => {
    // Submit a URL
    urlListPage.submitUrls('example.com');

    // Should show "X seconds ago" or similar
    urlListPage.shouldShowTimeAgo();
  });

  it('should switch between preview and source views', () => {
    // Submit a URL
    urlListPage.submitUrls('example.com');

    // Wait for success
    urlListPage.waitForUrlToComplete('https://example.com');

    // Click to view content
    urlListPage.clickUrlCard('https://example.com');

    // Should see both tabs
    urlContentPage.shouldBeVisible();

    // Click Source tab
    urlContentPage.clickSourceTab();

    // Should see HTML source code
    urlContentPage.shouldShowSourcePanel().shouldShowSourceCode();

    // Click Preview tab
    urlContentPage.clickPreviewTab();

    // Should see preview panel
    urlContentPage.shouldShowPreviewPanel();
  });

  it('should navigate back from content page to list', () => {
    // Submit and view content
    urlListPage.submitUrls('example.com');
    urlListPage.waitForUrlToComplete('https://example.com');
    urlListPage.clickUrlCard('https://example.com');

    // Verify on content page
    urlContentPage.shouldBeOnContentPage();

    // Click back button
    urlContentPage.clickBackButton();

    // Should be back on list page
    cy.url().should('not.include', '/content');
    urlListPage.shouldShowUrlCard('https://example.com');
  });
});
