interface SpeechBubbleProps {
	text: string;
	className?: string;
}

const SpeechBubble = ({ text, className = "" }: SpeechBubbleProps) => {
	return (
		<div className="bubble-white">
			{text}
			<div
				className="bubble-white-under"
			/>
		</div>
	);
};

export default SpeechBubble;