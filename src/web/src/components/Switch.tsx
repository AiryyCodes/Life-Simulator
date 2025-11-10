export type SwitchProps = {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
};

export default function Switch({ checked, onCheckedChange, disabled }: SwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => !disabled && onCheckedChange(!checked)}
			className={`
        relative inline-flex h-7 w-12 items-center rounded-xl transition-colors
        ${checked ? "bg-green" : "bg-red"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
		>
			<span
				className={`
          inline-block h-5 w-5 transform rounded-lg bg-white transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
			/>
		</button>
	);
}
