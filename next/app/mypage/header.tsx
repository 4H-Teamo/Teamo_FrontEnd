
import Button from "@/app/components/button/button";
import React from "react";
import {useForm} from "react-hook-form";

const Header = () => {
	const methods = useForm();
	const onSubmit = methods.handleSubmit((data) => {
		console.log('Form Submitted:', data);
	});
	return (
				<header className="w-full flex justify-end items-center px-8 bg-white">
					<div className="flex items-center gap-x-10 mr-6">
							<Button className="button-common" onClick={onSubmit} >저장</Button>
					</div>
				</header>

	)}

export default Header;