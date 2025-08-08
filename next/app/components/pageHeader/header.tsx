'use client';

import Button from "@/app/components/button/button";

interface PageHeaderProps {
	title:string;
	button?: boolean;
	buttonText?: string;
	onClick?: () => void;
}

const PageHeader = ({title,button,buttonText,onClick}:PageHeaderProps)=>{
	return(
		<div className="flex items-center justify-between">
			<div className="text-black font-bold text-2xl ">{title}</div>
			{button && onClick && (
				<Button className="button-circle" onClick={onClick}>
					{buttonText}
				</Button>)}
		</div>
		
	)
}
export default PageHeader;