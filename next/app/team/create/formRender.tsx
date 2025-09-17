import InputForm from "@/app/components/form/inputForm";
import Stack from "@/app/components/techStack/stack";
import TextArea from "@/app/components/textArea/textArea";
import React from "react";
import { Controller, Control } from "react-hook-form";
import WorkMode from "@/app/components/workMode/workMode";
import Calendar from "@/app/components/datebox/dateBox";
import Position from "@/app/components/position/position";

const getFormMap = (control: Control<any>): Record<string, React.FC<any>> => ({
  title: (props) => (
    <InputForm className="input-common" name="title" {...props} />
  ),
  content: (props) => (
    <TextArea
      name="content"
      {...props}
      className="lg:w-full"
      placeholder={props.placeholder}
    />
  ),
  capacity: (props) => (
    <InputForm
      className="input-medium"
      name="capacity"
      {...props}
      type="number"
      min="1"
    />
  ),
  positions: () => (
    <Controller
      name="positions"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Position
          value={field.value || []}
          onChange={field.onChange}
          className=""
        />
      )}
    />
  ),
  stacks: () => (
    <Controller
      name="stacks"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Stack
          value={field.value}
          className="lg:w-full"
          onChange={field.onChange}
        />
      )}
    />
  ),
  workMode: (props) => <WorkMode name="workMode" {...props} />,
  location: (props) => (
    <InputForm className="input-small" name="location" {...props} />
  ),
  endDate: () => (
    <Controller
      name="endDate"
      control={control}
      render={({ field }) => (
        <Calendar
          value={field.value}
          onChange={(date: string) => field.onChange(date)}
        />
      )}
    />
  ),
});

export default getFormMap;
