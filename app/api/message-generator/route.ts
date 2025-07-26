import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { db } from "@/db";
import { records } from "@/db/schema";
import { desc } from "drizzle-orm";
import bot from "@/bot";

function calculate_percentage(distance_km: number): number {
  const PERIGEE_KM = 363300;
  const APOGEE_KM = 405500;

  return ((distance_km - PERIGEE_KM) / (APOGEE_KM - PERIGEE_KM)) * 100;
}

export async function GET(req: Request) {
  if (req.headers.get("X-Secret-Key") !== process.env.CRON_JOB_SECRET)
    return NextResponse.json(
      {
        message: "Access denied",
      },
      {
        status: 403,
      },
    );

  const result = await fetch("https://theskylive.com/moon-info", {
    headers: {
      cookie:
        "_ga=GA1.1.1954036126.1752309111; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQUcHcAQUcHcAEsACBENBzFoAP_gAEPgABCYK1ID_C7EbCFCiDp3IKMEMAhHABBAYsAwAAYBAwAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAVAABAAAwAIBAIIAAAgAAAAEAIAAAACIAAEQCAAAAEAEAAkAgAAAIASAAAAAAAAACBAAAAAAAAAAAAAAAABAAAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQR2QD-F2I2EKFEHCuQUYIYBCuACAAxYBgAAwCBgAAGCQgQAgFJIIkCAEAIEAAEAAAQAgCAABQABAAAIAAAAAqAACAABgAQCAQQIABAAAAgIAAAAAAEQAAIgEAAAAIAIABABAAAAQAkAAAAAAAAAECAAAAAAAAAAAAAAAAAAAAAEABgAAAAAABEAAAAAAAACAQIAAA%22%2C%222~61.89.122.184.196.230.314.318.442.445.494.550.576.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1765.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2387.2416.2501.2567.2568.2575.2657.2686.2778.2869.2878.2908.2920.2963.3005.3023.3100.3126.3219.3234.3235.3253.3309.3731.6931.8931.13731.15731~dv.%22%2C%22B28C80E2-5537-4495-8B71-05F6BA3BABDE%22%5D%5D; localdata_v1=35.69439%7C51.42151%7CTehran+%28IR%29%7CAsia%2FTehran%7C0; theskylive_stat=b68ouj0wD%2Bg%2FwWwiqTDjlJ6TnFArFUPN%2Fc85RZrd5iFLpRfXaMkgAACX1PJuj055By4CP%2BANv5Y3coOB7k9JEvYgfwaphXIx66YAPK1swct3KiJ1FWpjqOdXS3u6WVqXbNDOS%2FHMG6XQMXECr2dgSta6pKIgdFNc0L9z7JBqTgiPsH%2FyFxq5qU7vTu4%3D; __eoi=ID=0cc8e93698ad2acd:T=1752309117:RT=1753487434:S=AA-AfjalQ0eW_NYNX5EtdrT7C10H; _ga_MJ91TBCWBK=GS2.1.s1753487434$o6$g0$t1753487435$j59$l0$h0; FCNEC=%5B%5B%22AKsRol9qn9BkIDX5MbTemYBUURYh2WL1wvzZJjacZB_6jBRtMnWci6q2egtsQT-HO9SSU7R4nSrweyk7BOFwxYse2yitiCAKSN4YEZxHhueJvFMoh9JOhIiyGHo-lDVznC_0bhednqLgNCCuQSSpUVhmqwMX8pKK-g%3D%3D%22%5D%5D",
    },
    body: null,
    method: "GET",
  });

  const body = await result.text();
  const $ = cheerio.load(body);
  const distanceNumber = parseFloat(
    $(".distanceKm").first().text().replace(",", ""),
  );
  const distancePercentage = calculate_percentage(distanceNumber);

  const lastOne = (
    await db.select().from(records).orderBy(desc(records.created_at))
  )?.[0];

  const data = {
    distance: distanceNumber.toFixed(1),
    percentage: distancePercentage.toFixed(1),
    position: lastOne?.distance
      ? lastOne?.distance > distanceNumber
        ? "receding"
        : "approaching"
      : "",
  };

  await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHANNEL_ID!,
    `🌚 Moon distance from earth: ${data.distance}\r\n📊 Percentage until reaches end of it's cycle: ${data.percentage}\r\nRight now: ${data.position}`,
  );
}
