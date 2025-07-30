'use client'
import Avatar from "@/app/components/avatar/avatar";
import UserInfoForm from "@/app/mypage/userInfoForm";
import { useForm, FormProvider } from "react-hook-form";
import Header from "./header"
const Mypage = () => {
	const methods = useForm();
	const onSubmit = methods.handleSubmit((data) => {
		console.log('Form Submitted:', data);
	});
	return(
		<FormProvider {...methods} >
			<form onSubmit={onSubmit}>
				<Header />
			<div className="leading-5 text-sm flex flex-col justify-items-center justify-center align-middle font-light text-gray10">
				<Avatar/>
				<UserInfoForm/>
			</div>
			</form>
		</FormProvider>

	)
}

export default Mypage;