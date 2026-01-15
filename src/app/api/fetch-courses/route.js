import { NextResponse } from "next/server";
import * as cheerio from "cheerio"

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    if (!branchId) {
        return NextResponse.json({ "error": "ID gerekli!" }, { status: 400 });
    }

    try {
        const tableUrl = `https://obs.itu.edu.tr/public/DersProgram/DersProgramSearch?programSeviyeTipiAnahtari=LS&dersBransKoduId=${branchId}`;
        const tableResponse = await fetch(tableUrl);
        const html = await tableResponse.text();

        const $ = cheerio.load(html);
        const courses = [];

        $("table tr").each((_, row) => {
            const cols = $(row).find("td");
            if (cols.length === 0) return;

            const crn = $(cols[0]).text().trim();
            const courseCode = $(cols[1]).text().trim();
            const courseTitle = $(cols[2]).text().trim();
            const courseFormat = $(cols[3]).text().trim() === "Fiziksel (Yüz yüze)" ? "Yüz yüze" : "Çevrim içi";
            const instructor = $(cols[4]).text().trim().replace("-", "Hoca bilgisi yok");
            const buildings = $(cols[5]).find("a").html()?.split("<br>") || [];
            const days = $(cols[6]).html()?.split('<br>') || [];
            const times = $(cols[7]).html()?.split('<br>') || [];

            days.forEach((dayRaw, index) => {
                const timeRaw = times[index] || "";
                const buildingRaw = buildings[index] || buildings[0] || "";

                if (!dayRaw || !timeRaw) return;

                const [start, end] = timeRaw.split("/");

                courses.push({
                    crn,
                    courseCode,
                    courseTitle,
                    courseFormat,
                    instructor,
                    building: buildingRaw.trim(),
                    day: dayRaw.trim(),
                    startTime: start?.trim(),
                    endTime: end?.trim(),
                });
            });
        });

        return NextResponse.json({ data: courses });
    }
    catch (error) {
        console.log("Hata: ", error);
        return NextResponse.json({ "error": "Sunucu hatasi olustu." }, { status: 500 });
    }
}
