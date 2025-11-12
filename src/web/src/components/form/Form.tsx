import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<any>;
	onSubmit: (data: any) => void;
	children: React.ReactNode;
	className?: string;
};

export default function Form({ form, onSubmit, children, className }: Props) {
	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={className}>
				{children}
			</form>
		</FormProvider>
	);
}
