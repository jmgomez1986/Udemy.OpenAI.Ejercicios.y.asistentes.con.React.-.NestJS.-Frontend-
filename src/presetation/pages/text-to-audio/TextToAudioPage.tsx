import { useState } from 'react';
import {
  GptMessage,
  GptAudioMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from '../../components';
import { textToAudioUseCase } from '../../../core/use.cases';

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  type: 'audio';
  audio: string;
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const voices = [
    { id: 'alloy', text: 'Alloy' },
    { id: 'ash', text: 'Ash' },
    { id: 'ballad', text: 'Ballad' },
    { id: 'coral', text: 'Coral' },
    { id: 'echo', text: 'Echo' },
    { id: 'fable', text: 'Fable' },
    { id: 'nova', text: 'Nova' },
    { id: 'onyx', text: 'Onyx' },
    { id: 'sage', text: 'Sage' },
    { id: 'shimmer', text: 'Shimmer' },
    { id: 'verse', text: 'Verse' },
    { id: 'marin', text: 'Marin' },
    { id: 'cedar', text: 'Cedar' },
  ];
  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Lee el texto: "${text}" con la voz ${selectedOption}`;
    setMessages((prev) => [
      ...prev,
      { text: newMessage, isGpt: false, type: 'text' },
    ]);

    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedOption,
    );

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: message, isGpt: true, type: 'text' },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: ` Aquí tienes el audio generado para el texto: "${text}" con la voz ${selectedOption}`,
          isGpt: true,
          type: 'audio',
          audio: audioUrl!,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="Hola, escribe un texto y selecciona una voz que quieras que lo lea" />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === 'audio' ? (
                <GptAudioMessage
                  key={index}
                  message={message.text}
                  audioUrl={message.audio}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
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
        options={voices}
      />
    </div>
  );
};
