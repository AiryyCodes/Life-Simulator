import { HashRouter } from "react-router";
import AppRoutes from "./routes";

import "./App.css";
import { useEffect } from "react";
import { useMainStore } from "@lib/store/main.store";
import myRpc from "@shared/rpc/rpc";

function App() {
	const updatePlayer = useMainStore((state) => state.updatePlayer);

	useEffect(() => {
		const intervalId = setInterval(async () => {
			try {
				const player = await myRpc.callClient("client:admin:player:get");
				updatePlayer(player);
			} catch (err) {
				console.warn("Failed to fetch player:", err);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [updatePlayer]);

	return (
		<>
			<HashRouter>
				<AppRoutes />
			</HashRouter>
		</>
	);
}

export default App;
