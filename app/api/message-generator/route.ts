import { PlaywrightCrawler } from "crawlee";
import { NextResponse } from "next/server";
import { chromium } from "playwright";

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

  const browser = await chromium.launch(); // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();

  await page.goto("https://theskylive.com/moon-info");
  await page.waitForSelector(".distanceKm.text-flash");

  const distance = await page.$(".distanceKm.text-flash");
  const distanceText = await distance?.innerText();
  if (!distanceText)
    return NextResponse.json(
      {
        success: false,
        message: "Distance text is incorrect",
      },
      {
        status: 500,
      },
    );

  const distanceNumber = parseFloat(distanceText.replace(",", ""));
  const percentageNumber = calculate_percentage(distanceNumber).toFixed(1);

  return NextResponse.json({
    success: true,
    data: {
      distance: `🌕 Live Moon Distance: ${distanceNumber.toFixed(1)}km`,
      percentage: `📊 Orbit Position: ${calculate_percentage(distanceNumber).toFixed(1)}%`,
    },
  });
}
