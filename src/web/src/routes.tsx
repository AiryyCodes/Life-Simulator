import { Route, Routes, useNavigate } from "react-router";
import { useEffect } from "react";
import { setNavigate } from "@lib/navigation";
import AuthPage from "@/views/auth/AuthPage";
import AdminMenu from "@/views/admin/AdminMenu";

export default function AppRoutes() {
	const navigate = useNavigate();

	useEffect(() => {
		setNavigate(navigate);
	}, [navigate]);

	return (
		<Routes>
			<Route path="/" element={null} />
			<Route path="/auth" element={<AuthPage />} />
			<Route path="/admin" element={<AdminMenu />} />
		</Routes>
	);
}
