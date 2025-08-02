'use client';

import React from "react";
import { useFormContext } from 'react-hook-form';
import getFormMap from './formRender';
import { CREATE_TEAM_LABEL } from "@/app/constants/forms/createTeamLabel";
import Label from "@/app/components/label/label";

const Content = () => {
	const { control } = useFormContext();
	const formMap = getFormMap(control);
	const rowItems = ["workMode", "location", "endDate"];
	const rowGroup = CREATE_TEAM_LABEL.filter(item => rowItems.includes(item.id));
	const colGroup = CREATE_TEAM_LABEL.filter(item => !rowItems.includes(item.id));

	return (
		<form>
			{colGroup.map(item => {
				const Component = formMap[item.id];
				if (!Component) return null;
				return (
					<div className="flex flex-col gap-2 mt-7" key={item.id}>
						<Label id={item.id} text={item.label} />
						<Component />
					</div>
				);
			})}
			<div className="flex flex-col gap-6 mt-7 justify-around md:flex-col w-full lg:flex-row">
				{rowGroup.map(item => {
					const Component = formMap[item.id];
					if (!Component) return null;
					return (
						<div className="flex flex-col gap-2 mt-7" key={item.id}>
							<Label id={item.id} text={item.label} />
							<Component />
						</div>
					);
				})}
			</div>
		</form>
	);
};

export default Content;