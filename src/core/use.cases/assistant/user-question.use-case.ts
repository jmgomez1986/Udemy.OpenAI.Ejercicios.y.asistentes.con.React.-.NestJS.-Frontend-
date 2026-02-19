import type { UserQuestionResponse } from '../../../interfaces';

export const userQuestionUseCase = async (
  threadId: string,
  question: string,
) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/user-question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          question,
        }),
      },
    );
    if (!resp.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const replies = (await resp.json()) as UserQuestionResponse[];
    return replies;
  } catch (error) {
    console.error(error);
    throw new Error('Error al enviar la pregunta');
  }
};
