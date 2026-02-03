import type {
  TranslateResponse,
  TranslateResponseUseCase,
} from "../../interfaces";

export const translateUseCase = async (
  prompt: string,
  lang: string,
): Promise<TranslateResponseUseCase> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) {
      throw new Error("Error en la solicitud a la API de GPT");
    }

    const data = (await resp.json()) as TranslateResponse;
    return {
      ...data,
      ok: true,
    };
  } catch (error) {
    console.error("Error in translateUseCase:", error);
    return {
      ok: false,
      content: "No se pudo realizar la traducción.",
    };
  }
};
