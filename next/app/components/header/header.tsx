"use client";

import {usePathname} from "next/navigation";
import SearchInput from "@/app/components/searchInput/searchInput";
import More from "@/app/assets/more.svg";
import React, {useState} from "react";
import MobileSidebar from "@/app/components/sidebar/mobileSidebar";
import Image from "next/image";



const Header = () => {
	const pathname = usePathname();
	const showHeader = ["/", "/team", "/teammate"].includes(pathname);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const openSidebar = () => setIsSidebarOpen(true);
	const closeSidebar = () => setIsSidebarOpen(false);
	return (
		<header className="w-full  flex justify-end items-center px-8 pt-4 bg-white mt-2">
			<div className="absolute left-0 ml-4 lg:hidden ">
				<button onClick={openSidebar}>
					<Image src={More} alt="more"/>
				</button>
				{isSidebarOpen && <MobileSidebar onClose={closeSidebar}/>}
			</div>
			<div className="flex items-center gap-x-10 mr-6">
				{showHeader &&
					<>
          <SearchInput readOnly={true}/>
					<div
					onClick={() => console.log("로그인 클릭")}
				className="text-base font-medium text-[#3E3E3E] cursor-pointer"
			>
				로그인
			</div>
          </>
				}

			</div>


		</header>
	);
};

export default Header;