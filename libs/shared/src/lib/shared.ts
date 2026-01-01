export type UrlRecordBase = {
  url: string;
  status: FetchStatus;
  createdAt: number;
};

export type UrlRecord = UrlRecordBase &
  (
    | {
        status: 'success';
        content: string;
        fetchTime: number;
      }
    | {
        status: 'loading';
      }
    | {
        status: 'failed';
        errorMessage: string;
        fetchTime: number;
      }
  );

export type FetchStatus = 'loading' | 'failed' | 'success';

export type HttpResponse<T = unknown> = { success: boolean; message?: string; data?: T };

export enum UrlServiceEvents {
  URL_UPDATED = 'urlUpdated',
}
