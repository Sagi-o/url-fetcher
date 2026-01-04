export type UrlRecordBase = {
  url: string;
  status: FetchStatus;
  createdAt: number;
  updatedAt: number;
};

export type UrlRecord = UrlRecordBase &
  (
    | {
        status: 'success';
        content: string;
        fetchTime: number;
        css?: string;
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

export enum UrlServiceEvents {
  URL_UPDATED = 'urlUpdated',
}
