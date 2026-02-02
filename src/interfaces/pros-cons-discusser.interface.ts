export interface prosConsDiscusserResponse {
  role: string;
  content: string;
  refusal: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  annotations: any[];
}

export interface prosConsDiscusserResponseUseCase extends prosConsDiscusserResponse {
  ok: boolean;
  message?: string;
}
