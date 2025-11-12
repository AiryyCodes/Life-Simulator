import { cn } from "@lib/utils/cn";
import type { ComponentProps } from "react";

import "./Input.css";

export type InputProps = {} & ComponentProps<"input">;

export default function Input({ className, ...props }: InputProps) {
	return (
		<input
			{...props}
			className={cn(
				"rounded-xl border-2 border-background-light transition-colors px-2 py-1 w-full placeholder:text-background-lightest",
				className,
			)}
		/>
	);
}
