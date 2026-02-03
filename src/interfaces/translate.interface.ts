export interface TranslateResponse {
  content: string;
}

export interface TranslateResponseUseCase extends TranslateResponse {
  ok: boolean;
}
