import {
  UrlRecordBase,
  UrlRecord,
  UrlServiceEvents,
  UrlSortField,
  SortOrder,
  PaginationParams,
  PaginatedResponse,
} from '@org/shared';
import { urlTable } from '../../utils/db';
import { EventEmitter } from 'events';
import { normalizeUrls } from '../../utils/url-helpers';
import { sortBy as sortArray } from '../../utils/sort';
import { paginate } from '../../utils/pagination';
import { uniq } from 'lodash';

export class UrlService extends EventEmitter {
  constructor() {
    super();
  }

  getUrlList(
    sortBy?: UrlSortField,
    order: SortOrder = 'desc',
    paginationParams: PaginationParams = { page: 1, limit: 10 }
  ): PaginatedResponse<UrlRecord> {
    let urls = Array.from(urlTable.values());

    // Apply sorting
    if (sortBy) {
      urls = sortArray<UrlRecord, UrlSortField>(urls, { field: sortBy, order });
    }

    // Always return paginated response
    return paginate(urls, paginationParams);
  }

  getUrlContent(url: string): string {
    const record = urlTable.get(url);
    if (!record) {
      throw new Error('URL not found');
    }
    if (record.status !== 'success') {
      throw new Error('URL content not available yet');
    }
    return record.content;
  }

  async fetchUrls(urls: string[]): Promise<UrlRecordBase[]> {
    const uniqueUrls = uniq(normalizeUrls(urls));
    const results: UrlRecordBase[] = [];

    // Set all URLs to loading state first
    for (const url of uniqueUrls) {
      const existingRecord = urlTable.get(url);
      const createdAt = existingRecord?.createdAt ?? Date.now();
      const updatedAt = Date.now();

      // Add to table with loading status
      const loadingRecord = {
        url,
        status: 'loading' as const,
        createdAt,
        updatedAt,
      };
      urlTable.set(url, loadingRecord);
      results.push(loadingRecord);

      // Emit loading state via SSE
      this.emit(UrlServiceEvents.URL_UPDATED, loadingRecord);
    }

    // Fetch all URLs in parallel
    Promise.all(
      uniqueUrls.map((url) => {
        const record = urlTable.get(url);
        const createdAt = record?.createdAt ?? Date.now();
        return this.fetchUrlContent(url, createdAt);
      })
    );

    return results;
  }

  private async fetchUrlContent(url: string, createdAt: number): Promise<void> {
    const startTime = Date.now();

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      const fetchTime = Date.now() - startTime;
      const updatedAt = Date.now();

      const record = {
        url,
        status: 'success' as const,
        content,
        createdAt,
        updatedAt,
        fetchTime,
      };
      urlTable.set(url, record);
      this.emit(UrlServiceEvents.URL_UPDATED, record);
    } catch (error) {
      const fetchTime = Date.now() - startTime;
      const updatedAt = Date.now();
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      const record = {
        url,
        status: 'failed' as const,
        errorMessage,
        createdAt,
        updatedAt,
        fetchTime,
      };
      urlTable.set(url, record);
      this.emit(UrlServiceEvents.URL_UPDATED, record);
    }
  }
}

export const urlService = new UrlService();
