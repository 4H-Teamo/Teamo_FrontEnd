interface SpeechBubbleProps {
  text: string;
}

const SpeechBubble = ({ text }: SpeechBubbleProps) => {
  return (
    <div className="bubble-white">
      {text}
      <div className="bubble-white-under" />
    </div>
  );
};

export default SpeechBubble;
