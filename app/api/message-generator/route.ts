import { db } from "@/db";
import { records } from "@/db/schema";
import { desc } from "drizzle-orm";
import bot from "@/bot";
import {
  exportSkyLiveInformation,
  getSkyLiveResponse,
  messageGenerator,
} from "@/app/api/message-generator/service";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const body = await getSkyLiveResponse();

  const lastOne = (
    await db.select().from(records).orderBy(desc(records.created_at))
  )?.[0];

  const { distanceNumber, distancePercentage, constellation } =
    await exportSkyLiveInformation(body);

  const data = {
    distance: distanceNumber.toFixed(1),
    percentage: distancePercentage.toFixed(1),
    position: lastOne?.distance
      ? lastOne?.distance > distanceNumber
        ? "receding"
        : "approaching"
      : "",
    constellation: constellation,
  };

  await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHANNEL_ID!,
    await messageGenerator(data),
  );

  return Response.json({
    success: true,
  });
}
