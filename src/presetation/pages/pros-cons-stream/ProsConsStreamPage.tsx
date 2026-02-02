import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import {
  prosConsDiscusserStreamGeneratorUseCase,
  prosConsDiscusserStreamUseCase,
} from "../../../core/use.cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // const reader = await prosConsDiscusserStreamUseCase(text);

    // setIsLoading(false);

    // if (!reader) {
    //   return;
    // }

    // // Generar el ultimo mensaje
    // const decoder = new TextDecoder();
    // let gptMessage = "";

    // setMessages((messages) => [...messages, { text: gptMessage, isGpt: true }]);

    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;
    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   gptMessage += decodedChunk;

    // setMessages((messages) => {
    //   const newMessages = [...messages];
    //   newMessages[newMessages.length - 1].text = gptMessage;
    //   return newMessages;
    // });
    // }

    const stream = prosConsDiscusserStreamGeneratorUseCase(
      text,
      abortController.current.signal,
    );
    setIsLoading(false);
    setMessages((messages) => [...messages, { text: "", isGpt: true }]);

    for await (const gptMessage of stream!) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = gptMessage;
        return newMessages;
      });
    }

    isRunning.current = false;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, ¿Qué deseas comparar?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            ),
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
