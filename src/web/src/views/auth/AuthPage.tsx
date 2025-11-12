import Menu from "@/components/Menu";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useState } from "react";

export default function AuthPage() {
	const [page, setPage] = useState<"login" | "register">("login");

	return (
		<div className="flex flex-row justify-end w-screen">
			{page === "login" ? <LoginPage onSwitch={() => setPage("register")} /> : <RegisterPage onSwitch={() => setPage("login")} />}
		</div>
	);
}
