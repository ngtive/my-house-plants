import { PlaywrightCrawler } from "crawlee";
import { NextResponse } from "next/server";

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
  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 10, // Limitation for only 10 requests (do not use if you want to crawl all links)
    async requestHandler({ log, page }) {
      log.info("Start crawling");

      const distance = await page.$(".distanceKm.text-flash");
      const distanceText = await distance?.innerText();
      if (!distanceText) return;

      const distanceNumber = parseFloat(distanceText.replace(",", ""));
      log.info(`🌕 Live Moon Distance: ${distanceNumber.toFixed(1)}km`);
      log.info(
        `📊 Orbit Position: ${calculate_percentage(distanceNumber).toFixed(1)}%`,
      );
    },
  });

  await crawler.run(["https://theskylive.com/moon-info"]);
}
