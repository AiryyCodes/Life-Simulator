import { navigate } from "@lib/navigation";
import { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";

@Service({ side: "web" })
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
