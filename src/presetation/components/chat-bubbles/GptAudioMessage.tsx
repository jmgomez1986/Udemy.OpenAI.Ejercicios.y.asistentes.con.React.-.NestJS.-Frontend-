import Markdown from 'react-markdown';

interface Props {
  message: string;
  audioUrl?: string;
}

export const GptAudioMessage = ({ message, audioUrl }: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 shrink-0">
          Gpt
        </div>
        <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          <Markdown>{message}</Markdown>
          <audio
            className="w-full mt-2"
            controls
            autoPlay
            src={audioUrl}
          ></audio>
        </div>
      </div>
    </div>
  );
};
