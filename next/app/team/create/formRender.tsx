import InputForm from "@/app/components/form/inputForm";
import Stack from "@/app/components/techStack/stack";
import TextArea from "@/app/components/textArea/textArea";
import React from "react";
import { Controller } from "react-hook-form";
import WorkMode from "@/app/components/workMode/workMode";

interface FormMapProps {
	control: any;
}

const getFormMap = (control: any): Record<string, React.FC<any>> => ({
	title: (props) => <InputForm className="input-common" name="title" {...props} />,
	content: (props) => <TextArea name="content" {...props} className="lg:w-full" placeholder={props.placeholder} />,
	capacity: (props) => <InputForm className="input-common" name="capacity" {...props} />,
	positions: (props) => <InputForm className="input-common" name="positions" {...props} />,
	stacks: () => (
		<Controller
			name="stacks"
			control={control}
			defaultValue={[]}
			render={({ field }) => <Stack value={field.value} onChange={field.onChange} />}
		/>
	),
	workMode: (props) => <WorkMode name="workMode" {...props} />,
	location: (props) => <InputForm className="input-common" name="location" {...props} />,
	endDate: (props) => <InputForm className="input-common" name="endDate" {...props} />,
});

export default getFormMap;