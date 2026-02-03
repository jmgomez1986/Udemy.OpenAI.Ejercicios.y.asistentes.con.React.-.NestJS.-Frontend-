import { useState } from 'react';
import {
  GptMessage,
  GptTranslateMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from '../../components';
import { translateUseCase } from '../../../core/use.cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const languages = [
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ];
  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);

    const { ok, content } = await translateUseCase(text, selectedOption);

    if (!ok) {
      setMessages((prev) => [...prev, { text: content, isGpt: true }]);
    } else {
      setMessages((prev) => [...prev, { text: content, isGpt: true }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, escribe un texto y selecciona al idioma que queres que lo traduzca" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptTranslateMessage key={index} message={message.text} />
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        options={languages}
      />
    </div>
  );
};
