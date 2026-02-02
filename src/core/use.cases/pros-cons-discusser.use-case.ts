import type {
  prosConsDiscusserResponse,
  prosConsDiscusserResponseUseCase,
} from "../../interfaces";

export const prosConsDiscusserUseCase = async (
  prompt: string,
): Promise<prosConsDiscusserResponseUseCase> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );

    if (!response.ok) {
      throw new Error(
        "Error en la solicitud a la API de GPT. No se pudo realizar la comparación.",
      );
    }

    const data = (await response.json()) as prosConsDiscusserResponse;
    return {
      ...data,
      ok: true,
    };
  } catch (error) {
    console.error("Error in prosConsDiscusserUseCase:", error);
    return {
      ok: false,
      role: "",
      content: "",
      refusal: "",
      annotations: [],
      message: "No se pudo realizar la comparación.",
    };
  }
};
