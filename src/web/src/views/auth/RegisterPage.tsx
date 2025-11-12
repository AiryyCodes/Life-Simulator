import Button from "@/components/button/Button";
import Form from "@/components/form/Form";
import Input from "@/components/input/Input";
import Label from "@/components/Label";
import Menu from "@/components/Menu";
import myRpc from "@shared/rpc/rpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormMessage from "@/components/form/FormMessage";
import FormField from "@/components/form/FormField";
import { useAuthStore } from "@lib/store/auth.store";

const schema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters."),
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters."),
	confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
});

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterPage({ onSwitch }: { onSwitch: () => void }) {
	const store = useAuthStore((state) => state);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: RegisterFormData) {
		if (data.password !== data.confirmPassword) {
			form.setError("root", { type: "validate", message: "Passwords do not match" });
			return;
		}

		const error = await myRpc.callServer("server:auth:register", [data.username, data.email, data.password, data.confirmPassword]);
		if (error) {
			form.setError("root", { type: "validate", message: error });
			return;
		}

		onSwitch();
	}

	return (
		<div className="flex flex-row justify-end w-screen">
			<Menu className="rounded-none h-screen justify-center items-center p-8">
				<Form form={form} onSubmit={onSubmit} className="flex flex-col gap-4 min-w-xs">
					<Label label="Register" className="text-center text-2xl" />
					<FormMessage background />
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<div className="flex flex-col gap-1">
								<Label label="Username" className="text-sm" />
								<Input required {...field} />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<div className="flex flex-col gap-1">
								<Label label="Email" className="text-sm" />
								<Input placeholder="mail@example.com" type="email" required {...field} />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<div className="flex flex-col gap-1">
								<Label label="Password" className="text-sm" />
								<Input type="password" required {...field} />
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<div className="flex flex-col gap-1">
								<Label label="Confirm Password" className="text-sm" />
								<Input type="password" required {...field} />
							</div>
						)}
					/>
					<div className="flex flex-col gap-2">
						<Button type="submit" startElement="Register" className="justify-center font-medium" />
						<div className="flex items-center justify-between">
							<button type="button" onClick={onSwitch} className="text-sm text-blue-400 hover:underline self-center">
								Already have an account?
							</button>
						</div>
					</div>
				</Form>
			</Menu>
		</div>
	);
}
