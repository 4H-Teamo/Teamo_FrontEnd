'use client';

import { useRouter } from 'next/navigation';
import {URL} from "@/app/constants/url"
const Header = ()=>{
	const router = useRouter();
	const handleClick=()=>{
		router.push(URL.CREATE_NEW_TEAM)
	}
	return(
		<>
			<div className="flex items-center justify-between">
				<div className="text-black font-bold text-2xl ">팀원 찾기</div>
			</div>
		</>
	)

}
export default Header;