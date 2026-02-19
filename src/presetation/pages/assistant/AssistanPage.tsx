import { useEffect, useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from '../../components';
import {
  createThreadUseCase,
  userQuestionUseCase,
} from '../../../core/use.cases';
import type { UserQuestionResponse } from '../../../interfaces';

interface Message {
  text: string;
  isGpt: boolean;
  info?: UserQuestionResponse;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();

  // Obtener el Thread y si no existe, crearlo y guardarlo en el localStorage
  useEffect(() => {
    const threadId = localStorage.getItem('threadId');
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase().then((thread) => {
        setThreadId(thread);
        localStorage.setItem('threadId', thread);
      });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `Número de thread: ${threadId}`, isGpt: true },
      ]);
    }
  }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const replies = await userQuestionUseCase(threadId, text);

    setIsLoading(false);

    setMessages([]);
    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          { text: message, isGpt: reply.role === 'assistant', info: reply },
        ]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, soy Sam, en que puedo ayudarte hoy?" />

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
