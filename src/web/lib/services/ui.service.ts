import { navigate } from "@lib/navigation";
import { WebService } from "@lib/service";
import { RPCHandler } from "@shared/rpc/rpc";

@WebService()
export class UIService {
	@RPCHandler("browser:page:show")
	onOpen(page: string) {
		navigate(`/${page}`);
	}

	@RPCHandler("browser:page:close")
	onClose() {
		navigate("/");
	}
}
