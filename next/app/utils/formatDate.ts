export const formatDate=(date:Date)=>{
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Asia/Seoul'
	};
	return new Intl.DateTimeFormat('ko-KR', options).format(date);

}
export const formatCalendar = (date: Date | null): string => {
	if (!date) return '';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};