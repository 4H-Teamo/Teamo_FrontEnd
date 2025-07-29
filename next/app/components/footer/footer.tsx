import Image from "next/image";
import logo from "@/app/assets/logo.svg";

const Footer = () => {
	return (
		<footer className="w-full relative  py-4 px-4   flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
			<div className="flex items-center justify-center">
				<Image
					src={logo}
					alt="Logo"
					className="w-24 h-auto md:w-32"
				/>
			</div>
			<p className="text-sm text-gray-500 text-center md:text-right">
				© 2025 Your Company. All rights reserved.
			</p>
		</footer>
	);
};

export default Footer;