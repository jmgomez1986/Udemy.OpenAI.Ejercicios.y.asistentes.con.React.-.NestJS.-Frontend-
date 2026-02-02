export const prosConsDiscusserStreamUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
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

    const reader = response.body?.getReader();
    if (!reader) {
      console.error("No se pudo generar el reader.");
      return null;
    }

    return reader;
    // const decoder = new TextDecoder();

    // let text = "";

    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;
    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   text += decodedChunk;

    //   console.log(text);
    // }
  } catch (error) {
    console.error("Error in prosConsDiscusserStreamUseCase:", error);
    return null;
  }
};
