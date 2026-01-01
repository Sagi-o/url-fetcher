import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { UrlCard } from '../UrlCard';
import { UrlRecord } from '@org/shared';

const renderWithMantine = (component: React.ReactElement) => {
  return render(<MantineProvider>{component}</MantineProvider>);
};

describe('UrlCard', () => {
  it('should render url card component', () => {
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'loading',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const { getByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={() => {}} />);

    expect(getByTestId('url-card')).toBeDefined();
    expect(getByTestId('url-text')).toBeDefined();
    expect(getByTestId('status-badge')).toBeDefined();
  });

  it('should display URL, status, and fetch time for successful fetch', () => {
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'success',
      content: '<html></html>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 342,
    };

    const { getByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={() => {}} />);

    const urlText = getByTestId('url-text');
    const statusBadge = getByTestId('status-badge');
    const fetchTimeBadge = getByTestId('fetch-time-badge');

    expect(urlText).toHaveTextContent('http://example.com');
    expect(statusBadge).toHaveTextContent('success');
    expect(fetchTimeBadge).toHaveTextContent('342ms');
    expect(getByTestId('time-ago')).toBeDefined();
  });

  it('should display error message when failed', () => {
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'failed',
      errorMessage: 'Connection timeout',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 5000,
    };

    const { getByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={() => {}} />);

    const errorMessage = getByTestId('error-message');
    const fetchTimeBadge = getByTestId('fetch-time-badge');

    expect(errorMessage).toHaveTextContent('Error: Connection timeout');
    expect(fetchTimeBadge).toHaveTextContent('5000ms');
  });

  it('should not show fetch time badge when loading', () => {
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'loading',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const { queryByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={() => {}} />);

    expect(queryByTestId('fetch-time-badge')).toBeNull();
  });

  it('should call onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'success',
      content: '<html></html>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 342,
    };

    const { getByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={mockOnClick} />);

    getByTestId('url-card').click();

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should show refetch button when onRefetch prop is provided', () => {
    const mockOnRefetch = vi.fn();
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'success',
      content: '<html></html>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 342,
    };

    const { getByTestId } = renderWithMantine(
      <UrlCard urlRecord={urlRecord} onClick={() => {}} onRefetch={mockOnRefetch} />
    );

    const refetchButton = getByTestId('refetch-button');
    expect(refetchButton).toBeDefined();
  });

  it('should not show refetch button when onRefetch is not provided', () => {
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'success',
      content: '<html></html>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 342,
    };

    const { queryByTestId } = renderWithMantine(<UrlCard urlRecord={urlRecord} onClick={() => {}} />);

    expect(queryByTestId('refetch-button')).toBeNull();
  });

  it('should not show refetch button when status is loading', () => {
    const mockOnRefetch = vi.fn();
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'loading',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const { queryByTestId } = renderWithMantine(
      <UrlCard urlRecord={urlRecord} onClick={() => {}} onRefetch={mockOnRefetch} />
    );

    expect(queryByTestId('refetch-button')).toBeNull();
  });

  it('should call onRefetch when refetch button is clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnRefetch = vi.fn();
    const urlRecord: UrlRecord = {
      url: 'http://example.com',
      status: 'success',
      content: '<html></html>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fetchTime: 342,
    };

    const { getByTestId } = renderWithMantine(
      <UrlCard urlRecord={urlRecord} onClick={mockOnClick} onRefetch={mockOnRefetch} />
    );

    const refetchButton = getByTestId('refetch-button');
    refetchButton.click();

    expect(mockOnRefetch).toHaveBeenCalledWith('http://example.com');
    expect(mockOnClick).not.toHaveBeenCalled(); // Should not trigger card click
  });
});
