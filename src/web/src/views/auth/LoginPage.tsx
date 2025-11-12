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
	email: z.email(),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormData = z.infer<typeof schema>;

export default function LoginPage({ onSwitch }: { onSwitch: () => void }) {
	const store = useAuthStore((state) => state);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginFormData) {
		const player = await myRpc.callServer("server:auth:login", [data.email, data.password]);
		if (!player) {
			form.setError("root", { type: "validate", message: "Invalid email or password" });
			return;
		}

		store.updatePlayer(player);
	}

	return (
		<Menu className="rounded-none h-screen justify-center items-center p-8">
			<Form form={form} onSubmit={onSubmit} className="flex flex-col gap-4 min-w-xs">
				<Label label="Login" className="text-center text-2xl" />
				<FormMessage background />
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
				<div className="flex flex-col gap-2">
					<Button type="submit" startElement="Login" className="justify-center font-medium" />
					<div className="flex items-center justify-between">
						<button onClick={onSwitch} className="text-sm">
							Create an account
						</button>
					</div>
				</div>
			</Form>
		</Menu>
	);
}
