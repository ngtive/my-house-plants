import { NextResponse } from "next/server";
import UserService from "./service";

export async function POST(req: Request) {
  const body = await req.json();

  UserService.createUser(
    body.message.from.id,
    body.message.from.first_name,
    body.message.from.last_name,
    body.message.from.username,
  ).catch(() => {});

  return NextResponse.json({
    method: "sendMessage",
    chat_id: body.message.chat.id,
    text: "Hi, here is my channel @moonliveupdate",
  });
}
