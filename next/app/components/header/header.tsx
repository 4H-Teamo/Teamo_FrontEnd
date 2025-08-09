"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import SearchInput from "@/app/components/searchInput/searchInput";
import More from "@/app/assets/more.svg";
import React, { useState } from "react";
import MobileSidebar from "@/app/components/sidebar/mobileSidebar";
import Image from "next/image";
import { URL } from "@/app/constants/url";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const showHeader = ["/", "/team", "/teammate"].includes(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSearch = () => router.push(URL.SEARCH);

  const handleAuthClick = () => {
    if (session) {
      // 로그인된 상태: 로그아웃
      signOut({ callbackUrl: "/" });
    } else {
      // 로그인되지 않은 상태: 로그인 페이지로 이동
      router.push(URL.LOGIN);
    }
  };

  return (
    <header className="w-full flex justify-end items-center px-8 pt-4 bg-white mt-2">
      <div className="absolute left-0 ml-4 lg:hidden ">
        <button onClick={openSidebar}>
          <Image src={More} alt="more" />
        </button>
        {isSidebarOpen && <MobileSidebar onClose={closeSidebar} />}
      </div>
      <div className="flex items-center gap-x-5 mr-6">
        {showHeader && (
          <>
            <SearchInput readOnly={true} onClick={handleSearch} />
            <div
              onClick={handleAuthClick}
              className="text-base font-medium text-[#3E3E3E] cursor-pointer"
            >
              {status === "loading"
                ? "로딩중..."
                : session
                  ? "로그아웃"
                  : "로그인"}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
