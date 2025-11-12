import { useFormContext } from "react-hook-form";
import Card from "@/components/card/Card";
import { cn } from "@lib/utils/cn";

type FormMessageProps = {
	background?: boolean;
	className?: string;
};

export default function FormMessage({ background = false, className }: FormMessageProps) {
	const {
		formState: { errors },
	} = useFormContext();

	if (Object.keys(errors).length === 0) return null;

	const messages = Object.entries(errors).map(([fieldName, error]) => (
		<p key={fieldName} className="text-sm">
			{error?.message?.toString()}
		</p>
	));

	if (background) {
		return <Card className={cn("bg-red border-red", className)}>{messages}</Card>;
	}

	return <div className={className}>{messages}</div>;
}
