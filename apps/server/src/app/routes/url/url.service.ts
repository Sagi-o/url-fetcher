import { UrlRecord, UrlRecordBase } from '@org/shared';

export class UrlService {
  getUrlList(): UrlRecordBase[] {
    return [{ url: 'url-1', status: 'loading' }];
  }

  getUrlContent(url: string): UrlRecord {
    return { url: 'abc.com', status: 'success', content: 'XYZ' };
  }

  async fetchUrls(urls: string[]): Promise<UrlRecordBase[]> {
    return [];
  }
}

export const urlService = new UrlService();
