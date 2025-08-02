import calendar from "@/app/assets/calendar.svg"
import Image from "next/image";
type Props = {
	dateText: string;
	onClick: () => void;
};


const DateBox = ({ dateText,onClick }: Props) => {
	return (
		<button onClick={onClick} className="input-calendar">
			<span className={dateText? "" : "text-gray20"}>{dateText || '날짜를 선택하세요'}</span>
<Image src={calendar} alt="달력"
/>
		</button>
	);
};

export default DateBox;