import type {
  GenerateImage,
  ImageGenerationResponse,
} from '../../../interfaces';

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string,
): Promise<GenerateImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-generation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          originalImage,
          maskImage,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Error en la generación de imagen: ${response.status}`);
    }

    const { url, revised_prompt: alt } =
      (await response.json()) as ImageGenerationResponse;
    return { url, alt };
  } catch (error) {
    console.log(error);
    return null;
  }
};
