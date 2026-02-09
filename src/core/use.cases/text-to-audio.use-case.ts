import type { TextToAudioResponseUseCase } from '../../interfaces';

export const textToAudioUseCase = async (
  prompt: string,
  voice: string,
): Promise<TextToAudioResponseUseCase> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) {
      throw new Error('Error en la solicitud a la API de GPT');
    }

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      audioUrl,
      message: prompt,
      ok: true,
    };
  } catch (error) {
    console.error('Error in textToAudioUseCase:', error);
    return {
      ok: false,
      message: 'No se pudo realizar la generación de audio.',
    };
  }
};
