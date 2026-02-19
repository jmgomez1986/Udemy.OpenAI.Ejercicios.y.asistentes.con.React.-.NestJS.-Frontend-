import type { OrtographyResponse } from "../../interfaces";

export const orthographyUseCase = async (
  prompt: string,
): Promise<OrtographyResponse> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPT_API}/orthography-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      },
    );

    if (!resp.ok) {
      throw new Error("Error en la solicitud a la API de GPT");
    }

    const data = (await resp.json()) as OrtographyResponse;
    return {
      ...data,
      ok: true,
    };
  } catch (error) {
    console.error("Error in orthographyUseCase:", error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: "No se pudo realizar la corrección ortográfica.",
    };
  }
};
