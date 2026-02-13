import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageSelectableImage,
} from '../../components';
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from '../../../core/use.cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Imagen base',
      info: {
        imageUrl:
          'http://localhost:3000/gpt/image-generation/1770996789025.png',
        alt: 'Imagen de ejemplo',
      },
    },
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    originalImage: undefined as string | undefined,
    maskImage: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const response = await imageVariationUseCase(
      originalImageAndMask.originalImage!,
    );
    setIsLoading(false);
    if (!response) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        text: 'Variación',
        isGpt: true,
        info: {
          imageUrl: response.url,
          alt: response.alt,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    const { originalImage, maskImage } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(
      text,
      originalImage,
      maskImage,
    );
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: 'No se pudo generar la imagen', isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.originalImage && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={
              originalImageAndMask.maskImage ??
              originalImageAndMask.originalImage
            }
            alt="Imagen original"
          />
          <button onClick={handleVariation} className="btn-primary mt-2">
            Generar variación
          </button>
        </div>
      )}

      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenida */}
            <GptMessage text="Hola, ¿qué imágen deseas generar?" />

            {messages.map((message, index) =>
              message.isGpt ? (
                // <GptMessageImage
                //   key={index}
                //   text={message.text}
                //   imageUrl={message.info?.imageUrl || ''}
                //   alt={message.info?.alt || ''}
                //   onImageSelected={(url) =>
                //     setOriginalImageAndMask({
                //       originalImage: url,
                //       maskImage: undefined,
                //     })
                //   }
                // />
                <GptMessageSelectableImage
                  key={index}
                  text={message.text}
                  imageUrl={message.info?.imageUrl || ''}
                  alt={message.info?.alt || ''}
                  onImageSelected={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      originalImage: message.info?.imageUrl,
                      maskImage: maskImageUrl,
                    })
                  }
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
    </>
  );
};
