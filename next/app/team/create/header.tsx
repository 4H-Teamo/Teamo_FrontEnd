'use client';

import Button from "@/app/components/button/button";

interface HeaderProps {
	onSubmit: () => void;
}

const Header = ({ onSubmit }: HeaderProps) => {
	return (
		<div className="">
			<div className="flex items-center justify-between">
				<div className="text-black font-bold text-2xl">팀 찾기</div>
				<Button className="button-common" onClick={onSubmit}>작성</Button>
			</div>
		</div>
	);
};

export default Header;