const fs = require('fs');
const cheerio = require('cheerio');

const SLEEP_TIME = 200;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCourseData() {
    console.log("Fetching course data...");
    const startTime = Date.now();

    try {
        const branchesRes = await fetch("https://obs.itu.edu.tr/public/DersProgram/SearchBransKoduByProgramSeviye?programSeviyeTipiAnahtari=LS");
        if (!branchesRes.ok) throw new Error(`Failed to fetch branches: ${branchesRes.statusText}`);
        const branches = await branchesRes.json();
        console.log(`Fetched ${branches.length} branches.`);

        let allCourses = [];
        let processedBranches = 0;

        for (const branch of branches) {
            const { dersBransKodu, bransKoduId } = branch;
            process.stdout.write(`\rProcessing branch ${++processedBranches}/${branches.length}: ${dersBransKodu}... `);

            try {
                const url = `https://obs.itu.edu.tr/public/DersProgram/DersProgramSearch?programSeviyeTipiAnahtari=LS&dersBransKoduId=${bransKoduId}`;
                const res = await fetch(url);
                const html = await res.text();
                const $ = cheerio.load(html);

                $("table tr").each((_, row) => {
                    const cells = $(row).find("td");
                    if (cells.length === 0) return;

                    const crn = $(cells[0]).text().trim();
                    const branchCode = $(cells[1]).text().trim().split(' ')[0];
                    const courseCode = $(cells[1]).text().trim().split(' ')[1];
                    const courseTitle = $(cells[2]).text().trim();
                    const courseFormat = $(cells[3]).text().trim() === "Fiziksel (Yüz yüze)" ? "Yüz yüze" : "Çevrim içi";
                    const instructor = $(cells[4]).text().trim().replace("-", "Eğitmen bilgisi yok");
                    const buildings = $(cells[5]).find("a").html()?.split("<br>") || [];
                    const days = $(cells[6]).html()?.split('<br>') || [];
                    const times = $(cells[7]).html()?.split('<br>') || [];
                    const classrooms = $(cells[8]).html()?.split('<br>') || [];
                    const capacity = $(cells[9]).text().trim();
                    const enrolled = $(cells[10]).text().trim();
                    const validMajors = $(cells[12]).text().trim().split(", ");

                    days.forEach((dayRaw, index) => {
                        const timeRaw = times[index] || "";
                        const buildingRaw = buildings[index] || buildings[0] || "";
                        const classroomRaw = classrooms[index] || classrooms[0] || "";
                        if (!dayRaw || !timeRaw) return;

                        const [start, end] = timeRaw.split("/");
                        allCourses.push({
                            crn,
                            branchCode,
                            courseCode,
                            courseTitle,
                            courseFormat,
                            instructor,
                            building: buildingRaw.trim(),
                            day: dayRaw.trim(),
                            startTime: start?.trim(),
                            endTime: end?.trim(),
                            classroom: classroomRaw.trim(),
                            capacity,
                            enrolled,
                            validMajors
                        });
                    });

                });
            }
            catch (error) {
                console.error(`\nError fetching courses for branch ${dersBransKodu}:`, error.message);
            }
            await sleep(SLEEP_TIME);
        }
        console.log(`\n\nFetched a total of ${allCourses.length} course entries in ${(Date.now() - startTime) / 1000}s.`);

        if (!fs.existsSync('./src/data')) {
            fs.mkdirSync('./src/data');
        }
        const finalData = {
            lastUpdated: new Date().toISOString(),
            courses: allCourses,
            branches: branches.map(b => b.dersBransKodu)
        };
        fs.writeFileSync('./src/data/courses.json', JSON.stringify(finalData));
        console.log("Data saved to ./src/data/courses.json");
    }
    catch (error) {
        console.error("Error fetching course data:", error);
        process.exit(1);
    }
}

fetchCourseData();
