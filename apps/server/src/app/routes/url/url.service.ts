import { UrlRecordBase, UrlRecord, UrlServiceEvents } from '@org/shared';
import { urlTable } from '../../utils/db';
import { EventEmitter } from 'events';
import { normalizeUrls } from '../../utils/url-helpers';

export class UrlService extends EventEmitter {
  constructor() {
    super();
  }
  getUrlList(): UrlRecord[] {
    return Array.from(urlTable.values());
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
    const normalizedUrls = normalizeUrls(urls);
    const results: UrlRecordBase[] = [];

    for (const url of normalizedUrls) {
      const createdAt = Date.now();

      // Add to table with loading status
      urlTable.set(url, { url, status: 'loading', createdAt });
      results.push({ url, status: 'loading', createdAt });

      // Fetch in background
      this.fetchUrlContent(url, createdAt);
    }

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

      const record = {
        url,
        status: 'success' as const,
        content,
        createdAt,
        fetchTime,
      };
      urlTable.set(url, record);
      this.emit(UrlServiceEvents.URL_UPDATED, record);
    } catch (error) {
      const fetchTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      const record = {
        url,
        status: 'failed' as const,
        errorMessage,
        createdAt,
        fetchTime,
      };
      urlTable.set(url, record);
      this.emit(UrlServiceEvents.URL_UPDATED, record);
    }
  }
}

export const urlService = new UrlService();
