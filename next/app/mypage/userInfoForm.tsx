'use client';
import Label from "@/app/components/label/label";
import { USERINFO_LABEL } from "@/app/constants/forms/userInfoLabel";
import InputForm from "@/app/components/form/inputForm";
import { useFormContext } from "react-hook-form";
import DropdownForm from "@/app/components/form/dropdownForm";
import Stack from "@/app/components/techStack/stack";

const UserInfoForm = () => {
	const { register, setValue, watch } = useFormContext();

	return (
		<div className="flex flex-col w-full gap-4 mt-6 justify-center items-center">
			<div className="flex flex-col w-full justify-center sm:flex-row sm:gap-16">
				{USERINFO_LABEL.filter(item => item.type === "text").map((item) => (
					<div key={item.id} className="flex flex-col gap-2 w-full sm:w-auto">
						<Label id={item.id} text={item.label} />
						<InputForm className="input-common" name={item.id} placeholder={item.placeholder} />
					</div>
				))}
			</div>

			<div className="flex flex-col mb-4 justify-center sm:flex-row gap-4 sm:gap-16 w-full items-center">
				{USERINFO_LABEL.filter(item => item.type === "select").map((item) => (
					<div key={item.id} className="flex  flex-col gap-2 w-full sm:w-auto">
						<Label id={item.id} text={item.label} />
						<DropdownForm
							options={item.options}
							value={watch(item.id)}
							onChange={(val) => setValue(item.id, val)}
							placeholder={item.placeholder}
						/>
					</div>
				))}
			</div>
			<Stack/>
		</div>
	);
};

export default UserInfoForm;