
import Button from "@/app/components/button/button";
import React from "react";

const Header = () => {
	return (
				<header className="w-full flex justify-end items-center px-8 bg-white">
					<div className="flex items-center gap-x-10 mr-6">
							<Button className="button-common" type="submit">저장</Button>
					</div>
				</header>

	)}

export default Header;