"use client";

import { usePathname, useRouter } from "next/navigation";
import SearchInput from "@/app/components/searchInput/searchInput";
import More from "@/app/assets/more.svg";
import React, { useState } from "react";
import MobileSidebar from "@/app/components/sidebar/mobileSidebar";
import Image from "next/image";
import { URL } from "@/app/constants/url";
import { useAuthStore } from "@/app/store/authStore";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const behindHeader = ["/mypage"].includes(pathname);
  // const showHeader = ["/", "/team", "/teammate"].includes(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSearch = () => router.push(URL.SEARCH);

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
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
        {!behindHeader && (
          <>
            <SearchInput readOnly={true} onClick={handleSearch} />
            <div
              onClick={handleAuthClick}
              className="text-base font-medium text-[#3E3E3E] cursor-pointer"
            >
              {user ? "로그아웃" : "로그인"}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
