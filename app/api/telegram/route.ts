import {NextResponse} from "next/server";

export async function POST(req: Request, res: Response) {
    const body = await req.json();

    return NextResponse.json({
        method: 'sendMessage',
        chat_id: body.message.chat.id,
        text: 'Hello'
    })
}