import type {
  GenerateImage,
  ImageGenerationResponse,
} from '../../../interfaces';

export const imageVariationUseCase = async (
  originalImage: string,
): Promise<GenerateImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/image-variation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseImage: originalImage,
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
