export type UrlRecordBase = {
  url: string;
  status: FetchStatus;
};

export type UrlRecord = UrlRecordBase &
  (
    | {
        status: 'success';
        content: string;
      }
    | {
        status: 'loading' | 'failed';
      }
  );

export type FetchStatus = 'loading' | 'failed' | 'success';

export type HttpResponse<T = unknown> = { success: boolean; message?: string; data?: T };
