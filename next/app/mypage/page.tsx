'use client'
import Avatar from "@/app/components/avatar/avatar";
import UserInfoForm from "@/app/mypage/userInfoForm";
import { useForm, FormProvider } from "react-hook-form";
const Mypage = () => {
	const methods = useForm();

	// const onSubmit = (data: any) => {
	// 	console.log(data);
	// };
	return(
		<FormProvider {...methods} >
			<form >
			<div className="leading-5 text-sm  text-gray10">
				<Avatar/>
				<UserInfoForm/>
			</div>
			</form>
		</FormProvider>

	)
}

export default Mypage;