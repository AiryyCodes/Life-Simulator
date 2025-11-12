import { cn } from "@lib/utils/cn";

export type LabelProps = {
	label?: string;

	className?: string;
};

export default function Label({ label, className }: LabelProps) {
	return <h1 className={cn("text-xl", className)}>{label}</h1>;
}
