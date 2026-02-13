export interface Image {
  url: string;
  alt: string;
}

export interface ImageGenerationResponse {
  url: string;
  revised_prompt: string;
}

export type GenerateImage = Image | null;
