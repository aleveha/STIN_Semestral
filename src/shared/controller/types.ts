import { MessageContext, TextContext } from "../../types";

/**
 * @description Shared controller interface
 */
export interface ISharedController {
	badRequest(ctx: MessageContext): Promise<void>;

	help(ctx: TextContext): Promise<void>;

	info(ctx: TextContext): Promise<void>;

	name(ctx: TextContext): Promise<void>;

	start(ctx: TextContext): Promise<void>;

	time(ctx: TextContext): Promise<void>;
}