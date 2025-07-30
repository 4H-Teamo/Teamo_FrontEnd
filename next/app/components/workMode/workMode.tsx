import {WORK_MODE} from "@/app/constants/forms/workMode";
import Button from "@/app/components/button/button";
import clsx from "clsx";
import {useState} from "react";
import {useFormContext} from "react-hook-form";
interface workModeProps {
	name: string;
}

const WorkMode = ({name}:workModeProps) => {
	const [selected, setSelected] = useState<string | null>(null);
	const {setValue}=useFormContext();
	const handleClick =(id:string)=>{
		setSelected((prev)=>(prev===id?null:id));
		setValue(name,id)
	}
	return (
		<div className="flex gap-2">
			{WORK_MODE.map((item) => (
				<Button className={clsx("button-circle", selected===item.id &&"bg-main text-white")} key={item.id} onClick={()=>handleClick(item.id)}>{item.label}</Button>
			))}
		</div>
	)
}

export default WorkMode;