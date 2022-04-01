import { Context, NarrowedContext } from "telegraf";
import { Update } from "typegram";
import { MountMap } from "telegraf/typings/telegram-types";

export type TextContext = NarrowedContext<Context<Update>, MountMap["text"]>;
