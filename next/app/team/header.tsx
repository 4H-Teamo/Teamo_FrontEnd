'use client';
import Button from "@/app/components/button/button";
import { useRouter } from 'next/navigation';
import {URL} from "@/app/constants/url"
const Header = ()=>{
	const router = useRouter();
	const handleClick=()=>{
		router.push(URL.CREATE_NEW_TEAM)
	}
	return(
		<div className="">
			<div className="flex items-center justify-between">
				<div className="text-black font-bold text-2xl ">팀 찾기</div>
				<Button className="button-circle" onClick={handleClick}>글 작성하기</Button>
			</div>
		</div>
		)

}
export default Header;