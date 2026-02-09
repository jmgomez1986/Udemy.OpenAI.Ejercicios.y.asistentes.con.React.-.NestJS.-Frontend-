import type { AudioToTextResponse } from '../../interfaces';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    if (prompt) {
      formData.append('prompt', prompt);
    }

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!resp.ok) {
      throw new Error('Error en la solicitud a la API de GPT');
    }

    const data = (await resp.json()) as AudioToTextResponse;
    return {
      ...data,
      ok: true,
    };
  } catch (error) {
    console.error('Error in audioToTextUseCase:', error);
    return null;
  }
};
