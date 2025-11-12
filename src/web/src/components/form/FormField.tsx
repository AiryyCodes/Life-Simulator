import { Controller, Control, FieldPath, FieldValues, ControllerProps } from "react-hook-form";

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
	control: Control<TFieldValues>;
	name: TName;
	render: ControllerProps<TFieldValues, TName>["render"];
};

export default function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
	control,
	name,
	render,
}: FormFieldProps<TFieldValues, TName>) {
	return <Controller control={control} name={name} render={render} />;
}
