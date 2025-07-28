import localFont from "next/font/local";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";
import "@/app/globals.css";
import {Metadata} from "next";
import Sidebar from "@/app/components/sidebar/index";
import React from "react";

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
		icon:  "/logoFavicon64.png",
		shortcut: "/logoSymbol.png",
		apple: "/logoSymbol.png",
	},
};
export default function RootLayout({
	                                   children,
                                   }: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className={pretendard.variable}>
		<body className={pretendard.className}>
		<div className="flex h-screen overflow-hidden">
			<Sidebar/>
			<div className="flex flex-col flex-1 overflow-auto">
				<Header />
				<main className="w-full h-screen bg-light overflow-auto px-9 py-4">{children}</main>
			</div>
			<Footer />
		</div>
		</body>
		</html>
	);
}