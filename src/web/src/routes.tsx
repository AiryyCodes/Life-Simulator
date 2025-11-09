import { Route, Routes, useNavigate } from "react-router";
import AdminMenu from "./views/admin/AdminMenu";
import { useEffect } from "react";
import { setNavigate } from "@lib/navigation";

export default function AppRoutes() {
	const navigate = useNavigate();

	useEffect(() => {
		setNavigate(navigate);
	}, [navigate]);

	return (
		<Routes>
			<Route path="/" element={null} />
			<Route path="/admin" element={<AdminMenu />} />
		</Routes>
	);
}
