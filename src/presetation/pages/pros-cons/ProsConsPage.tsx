import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use.cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    message: string;
  };
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const response = await prosConsDiscusserUseCase(text);

    setIsLoading(false);

    if (!response.ok) {
      setMessages((prev) => [...prev, { text: response.content, isGpt: true }]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: response.content,
          isGpt: true,
          info: { message: response.content },
        },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, puedes escribir lo que quieras que compare?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage
                key={index}
                text={message.info?.message || "Esto es de OpenAI"}
              />
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
