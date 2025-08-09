import localFont from "next/font/local";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";
import "@/app/globals.css";
import { Metadata } from "next";
import Sidebar from "@/app/components/sidebar/index";
import React from "react";
import AuthProvider from "@/app/providers/AuthProvider";
import RootProvider from "@/app/providers/RootProvider";
import LoginHandler from "@/app/components/auth/LoginHandler";

const pretendard = localFont({
  src: "../public/font/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
export const metadata: Metadata = {
  title: "Teamo",
  description: "사이드 프로젝트 모집 플랫폼 Teamo.",
  icons: {
    icon: "/logoFavicon64.png",
    shortcut: "/logoSymbol.png",
    apple: "/logoSymbol.png",
  },
};

const RootLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <AuthProvider>
          <RootProvider>
            <LoginHandler />
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex flex-col flex-1 min-h-screen">
                <Header />
                <main className="flex-1 bg-light overflow-auto px-9 py-4">
                  {children}
                  {modal}
                </main>
              </div>
            </div>
            <Footer />
          </RootProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
