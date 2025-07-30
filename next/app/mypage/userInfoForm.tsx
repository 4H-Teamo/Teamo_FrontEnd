'use client';
import Label from "@/app/components/label/label";
import { USERINFO_LABEL } from "@/app/constants/forms/userInfoLabel";
import InputForm from "@/app/components/form/inputForm";
import {Controller, useFormContext} from "react-hook-form";
import DropdownForm from "@/app/components/form/dropdownForm";
import Stack from "@/app/components/techStack/stack";
import PublicToggle from "@/app/components/toggle/toggle";
import TextArea from "@/app/components/textArea/textArea";

const UserInfoForm = () => {
	const { control, setValue, watch } = useFormContext();

	return (
		<div className="flex flex-col gap-4 mt-6 justify-center items-center">
			<div className="flex flex-col w-full justify-center sm:flex-row sm:gap-16">
				{USERINFO_LABEL.filter(item => item.type === "text").map((item) => (
					<div key={item.id} className="flex flex-col gap-2  sm:w-[15rem]">
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
		{USERINFO_LABEL.filter(item=>item.type==="multiSelect").map((item)=>(
			<div key={item.id} className="flex  flex-col gap-2 w-full sm:w-auto">
				<Label id={item.id} text={item.label} />
				<Controller
					name={item.id}
					defaultValue={[]}
					control={control}
					render={({ field }) => (
						<Stack value={field.value} onChange={field.onChange} />
					)}
				/>
			</div>
			))}
		{USERINFO_LABEL.filter(item => item.type === "textarea").map((item) => (
			<div key={item.id} className="flex  flex-col gap-2 w-full sm:w-auto">
				<Label id={item.id} text={item.label} />
				<Controller
				name={item.id}
				control={control}
				render={({ field }) => (
					<TextArea {...field} placeholder={item.placeholder} />
				)}
			/>
			</div>
		))}
					<Controller
						name="isPublic"
						control={control}
						render={({ field }) => (
							<PublicToggle isPublic={field.value} onToggle={() => field.onChange(!field.value)} />
						)}
					/>


		</div>
	);
};

export default UserInfoForm;