'use client';

import Content from "@/app/team/create/content";
import Header from "@/app/team/create/header";
import { useForm, FormProvider } from "react-hook-form";

const Create = () => {
	const methods = useForm();
	const onSubmit = methods.handleSubmit((data) => {
		console.log('Form Submitted:', data);
	});

	return (
		<FormProvider {...methods}>
			<div className="border-gray20 p-10 rounded-lg border">
				<Header onSubmit={onSubmit} />
				<Content />
			</div>
		</FormProvider>
	);
};

export default Create;