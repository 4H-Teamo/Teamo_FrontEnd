'use client';

import React from "react";
import { useFormContext } from 'react-hook-form';
import getFormMap from './formRender';
import { CREATE_TEAM_LABEL } from "@/app/constants/forms/createTeamLabel";

const Content = () => {
	const { control } = useFormContext();
	const formMap = getFormMap(control);

	return (
		<form>
			{CREATE_TEAM_LABEL.map((item) => {
				const Component = formMap[item.id];
				if (!Component) return null;
				return (
					<div key={item.id}>
						<div>{item.label}</div>
						<Component />
					</div>
				);
			})}
		</form>
	);
};

export default Content;