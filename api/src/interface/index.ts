export interface StorageEvent {
  topic: string;
  subject: string;
  eventType: string;
  id: string;
  data: {
    api: string;
    requestId: string;
    eTag: string;
    contentType: string;
    contentLength: number;
    blobType: string;
    url: string;
    sequencer: string;
    storageDiagnostics: {
      batchId: string;
    };
  };
  dataVersion: string;
  metadataVersion: string;
  eventTime: string;
}
